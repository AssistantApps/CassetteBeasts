export const handlebarTemplate = {
  home: 'pages/index.hbs',
  about: 'pages/about.hbs',

  // pages
  monster: 'pages/monster/monsterList.hbs',
  monsterDetail: 'pages/monster/monsterDetail.hbs',
  monsterMetaImage: 'partials/monster/monsterMetaImage.hbs',
  monsterStatHex: 'partials/monster/monsterStatHex.hbs',
  move: 'pages/move/moveList.hbs',
  moveDetail: 'pages/move/moveDetail.hbs',
  moveMetaImage: 'partials/move/moveMetaImage.hbs',
  character: 'pages/character/characterList.hbs',
  characterDetail: 'pages/character/characterDetail.hbs',
  characterMonsterTape: 'partials/character/characterMonsterTape.hbs',
  characterMetaImage: 'partials/character/characterMetaImage.hbs',
  elementReaction: 'pages/elementReaction/elementReactionGrid.hbs',
  statusEffect: 'pages/statusEffect/statusEffectList.hbs',
  statusEffectDetail: 'pages/statusEffect/statusEffectDetail.hbs',
  statusEffectMeta: 'partials/statusEffect/statusEffectMetaImage.hbs',
  worldTabs: 'pages/world/worldTabs.hbs',
  fusionDetail: 'pages/fusion/fusionDetail.hbs',

  // misc
  cname: 'misc/CNAME.hbs',
  colour: 'misc/colour.scss.hbs',
  humans: 'misc/humans.txt.hbs',
  openSearch: 'misc/opensearch.xml.hbs',
  privacyPolicy: 'misc/privacy_policy.html.hbs',
  robots: 'misc/robots.txt.hbs',
  sitemap: 'misc/sitemap.xml.hbs',
  termsAndConditions: 'misc/terms_and_conditions.html.hbs',
} as const;

export enum TemplateGenerationSpeed {
  Speedy,
  Slow,
}
