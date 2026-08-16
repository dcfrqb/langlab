/* ============================================================
   ICONS — один набор на весь проект.
   Раньше стрелки и галочки были юникодными символами (‹ › ✓ ⏻):
   разный вес в разных шрифтах, разный оптический размер, на части
   систем — эмодзи вместо знака. Здесь — инлайновый SVG: цвет
   наследуется от текста, размер задаётся классом .i / .i-lg.
   ============================================================ */

const PATHS = {
  'chevron-left':  '<path d="M15 5 8 12l7 7"/>',
  'chevron-right': '<path d="m9 5 7 7-7 7"/>',
  'arrow-right':   '<path d="M4 12h15"/><path d="m13 5 7 7-7 7"/>',
  check:           '<path d="m4 12 5 5L20 6"/>',
  close:           '<path d="M6 6l12 12M18 6L6 18"/>',
  sun:             '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:            '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
  contrast:        '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18Z" fill="currentColor" stroke="none"/>',
  logout:          '<path d="M12 3v9"/><path d="M6.4 6.4a8 8 0 1 0 11.2 0"/>',
  spark:           '<path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>',
};

/**
 * @param {string} name  ключ из PATHS
 * @param {{size?: 'md'|'lg', title?: string}} opts
 */
export function icon(name, { size = 'md', title = '' } = {}) {
  const body = PATHS[name];
  if (!body) return '';
  return `<svg class="i${size === 'lg' ? ' i-lg' : ''}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
    ${title ? `role="img" aria-label="${title}"` : 'aria-hidden="true"'}>${body}</svg>`;
}
