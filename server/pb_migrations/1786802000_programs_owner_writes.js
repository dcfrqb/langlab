/// <reference path="../pb_data/types.d.ts" />

/**
 * Программу теперь заводит сам опрос — значит владелец должен уметь её писать.
 * Приложение создаёт программу только если её ещё нет и никогда не перезаписывает
 * чужую правку, поэтому ручная настройка из админки не затирается.
 * Поле `source` показывает, откуда программа: опрос или руки.
 */
migrate((app) => {
  const programs = app.findCollectionByNameOrId('programs');
  const own = '@request.auth.id != "" && user = @request.auth.id';

  programs.createRule = own;
  programs.updateRule = `${own} && @request.body.user:isset = false`;
  programs.fields.add(new TextField({ name: 'source', max: 16 }));

  app.save(programs);
}, (app) => {
  const programs = app.findCollectionByNameOrId('programs');
  programs.createRule = null;
  programs.updateRule = null;
  programs.fields.removeByName('source');
  app.save(programs);
});
