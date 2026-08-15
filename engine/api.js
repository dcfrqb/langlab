/* ============================================================
   API — тонкий клиент PocketBase на fetch, без SDK и сборки.
   API живёт на том же домене (/api/), поэтому ни CORS, ни базового URL.
   ============================================================ */

const BASE = '/api';
const AUTH_KEY = 'langlab.auth';       // { token, user: {id, email} }

let auth = read();

function read() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; } catch { return null; }
}

function write(value) {
  auth = value;
  try {
    if (value) localStorage.setItem(AUTH_KEY, JSON.stringify(value));
    else localStorage.removeItem(AUTH_KEY);
  } catch { /* приватный режим */ }
}

async function request(path, { method = 'GET', body, auth: needAuth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (needAuth && auth?.token) headers.Authorization = auth.token;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && needAuth) write(null);   // токен протух — выкидываем
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data.data || {};
    throw err;
  }
  return data;
}

export const api = {
  get user() { return auth?.user || null; },
  get isAuthed() { return !!auth?.token; },

  /* --- вход: почта → код из письма --- */
  async requestCode(email) {
    const r = await request('/collections/users/request-otp', {
      method: 'POST', body: { email: String(email).trim().toLowerCase() }, auth: false,
    });
    return r.otpId;
  },

  async submitCode(otpId, code) {
    const r = await request('/collections/users/auth-with-otp', {
      method: 'POST', body: { otpId, password: String(code).trim() }, auth: false,
    });
    write({ token: r.token, user: { id: r.record.id, email: r.record.email } });
    return api.user;
  },

  /* токен PocketBase живёт долго, но при старте проверяем, что он ещё жив */
  async refresh() {
    if (!auth?.token) return null;
    try {
      const r = await request('/collections/users/auth-refresh', { method: 'POST' });
      write({ token: r.token, user: { id: r.record.id, email: r.record.email } });
      return api.user;
    } catch (e) {
      if (e.status === 401) return null;
      return api.user;              // сеть лежит — работаем с тем, что есть
    }
  },

  logout() { write(null); },

  /* --- записи --- */
  async list(collection, { filter, sort, perPage = 200 } = {}) {
    const q = new URLSearchParams({ perPage: String(perPage) });
    if (filter) q.set('filter', filter);
    if (sort) q.set('sort', sort);
    const r = await request(`/collections/${collection}/records?${q}`);
    return r.items || [];
  },

  create(collection, data) {
    return request(`/collections/${collection}/records`, { method: 'POST', body: data });
  },

  update(collection, id, data) {
    return request(`/collections/${collection}/records/${id}`, { method: 'PATCH', body: data });
  },

  /* фильтр по себе — пишем его в одном месте, чтобы не размазывать по коду */
  mine(extra = '') {
    const base = `user="${auth?.user?.id || ''}"`;
    return extra ? `${base} && ${extra}` : base;
  },
};
