export const handlebarTemplate = {
  home: 'index.hbs',
  monster: 'partials/monster/monsterList.hbs',
  monsterDetail: 'partials/monster/monsterDetail.hbs',
  monsterMetaImage: 'partials/monster/monsterMetaImage.hbs',
  monsterStatHex: 'partials/monster/monsterStatHex.hbs',
  move: 'partials/move/moveList.hbs',
  moveDetail: 'partials/move/moveDetail.hbs',
  moveMetaImage: 'partials/move/moveMetaImage.hbs',
  character: 'partials/character/characterList.hbs',
  characterDetail: 'partials/character/characterDetail.hbs',
  characterMonsterTape: 'partials/character/characterMonsterTape.hbs',
  characterMetaImage: 'partials/character/characterMetaImage.hbs',
  elementReaction: 'partials/elementReaction/elementReactionGrid.hbs',
  statusEffect: 'partials/statusEffect/statusEffectList.hbs',
  statusEffectDetail: 'partials/statusEffect/statusEffectDetail.hbs',
  statusEffectMeta: 'partials/statusEffect/statusEffectMetaImage.hbs',
  worldTabs: 'partials/world/worldTabs.hbs',
  fusionDetail: 'partials/fusion/fusionDetail.hbs',

  // misc
  analytics: 'misc/analytics.js.hbs',
  cname: 'misc/CNAME.hbs',
  colour: 'misc/colour.scss.hbs',
  humans: 'misc/humans.txt.hbs',
  openSearch: 'misc/opensearch.xml.hbs',
  privacyPolicy: 'misc/privacy_policy.html.hbs',
  robots: 'misc/robots.txt.hbs',
  serviceWorker: 'misc/serviceWorker.js.hbs',
  site: 'misc/site.webmanifest.hbs',
  sitemap: 'misc/sitemap.xml.hbs',
  termsAndConditions: 'misc/terms_and_conditions.html.hbs',
} as const;

export enum TemplateGenerationSpeed {
  Speedy,
  Slow,
}
