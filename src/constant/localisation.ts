export const defaultLocale = 'en';
export const chineseLocale = 'zh_CN';
export const japaneseLocale = 'ja_JP';
export const koreanLocale = 'ko_KR';

export const UIKeys = {
  remaster: 'UI_EVOLUTION_TITLE', // remaster
  stickers: 'UI_PARTY_STICKERS', // stickers
  maxHP: 'SHORT_NAME_max_hp', // Max HP
  mAtk: 'SHORT_NAME_melee_attack', // M. Atk
  mDef: 'SHORT_NAME_melee_defense', // M. Def
  rAtk: 'SHORT_NAME_ranged_attack', // R. Atk
  rDef: 'SHORT_NAME_ranged_defense', // R. Def
  speed: 'SHORT_NAME_speed', // Speed
  elementalType: 'UI_INVENTORY_FILTER_TYPE', // Elemental Type:
  name: 'UI_INVENTORY_FILTER_NAME', // Name:
  category: 'UI_INVENTORY_FILTER_CATEGORY', // Category:
  power: 'MOVE_DESCRIPTION_POWER', // Power: {power}
  accuracy: 'STAT_accuracy', // Accuracy
  evasion: 'STAT_evasion', // Evasion
  maxAP: 'STAT_max_ap', // Max AP
  moveSlots: 'STAT_move_slots', // Move Slots
  aP: 'BATTLE_TOAST_AP', // {0} AP
  chance: 'BATTLE_TOAST_RECORD_CHANCE', // {0}%\\nCHANCE
  recording: 'STATUS_RECORDING_NAME', // Recording
  chooseSpecialisation: 'UI_EVOLUTION_SPECIALIZATION', // "Choose a specialisation."
  expPoints: 'STAT_exp', // Exp Points
  viewMonsters: 'UI_BESTIARY_LIST_MODE_VIEW_MONSTERS', // View Monsters
  viewStickers: 'UI_PARTY_VIEW_MOVES', // View Stickers
  elementalTypeChart: 'ITEM_TYPE_CHART_NAME', // Elemental Type Chart
  statusEffect: 'MOVE_CATEGORY_STATUS', // Status Effect
  language: 'TITLE_SCREEN_LANGUAGE_BUTTON', // Language
  other: 'UI_QUEST_LOG_SECTION_OTHER', // Other
  applySticker: 'UI_PARTY_APPLY_STICKER', // Apply Sticker
  stats: 'UI_BESTIARY_INFO_TAB_STATS', // Stats
  passive: 'UI_BUTTON_MOVE_PASSIVE', // Passive
  priorityChance: 'STAT_priority_chance', // Priority Chance
  humanForm: 'UI_PARTY_STATS_CHARACTER', // Human Form
  habitat: 'UI_BESTIARY_INFO_TAB_LOCATION', // Habitat
  unlockedAbility: 'ABILITY_UNLOCKED', // You’ve obtained the {ability} ability!
  dlcPierOfTheUnknown: 'DLC_01_PIER_NAME', // Pier of the Unknown
  attacker: 'TYPE_CHART_ATTACKER', // Attacker
  defender: 'TYPE_CHART_DEFENDER', // Defender
  transmutation: 'TYPE_CHART_TRANSMUTATION', // Transmutation
  noReaction: 'TYPE_CHART_NO_REACTION', // No Reaction
  buffs: 'TYPE_CHART_BUFFS', // Buff(s)
  debuffs: 'TYPE_CHART_DEBUFFS', // Debuff(s)
  map: 'UI_PAUSE_MAP_BTN', // Map
  typeless: 'UI_INVENTORY_FILTER_TYPE_TYPELESS', // Typeless
  cassetteBeasts: 'MAIN_CREDITS_TITLE', // Cassette Beasts
  homePageLongText1: 'TUTORIAL_REMASTER', // long text for home page
  homePageLongText2: 'TUTORIAL_RUMORS_DESCRIPTION1', // long text for home page
} as const;

export const UIKeysRemoveTrailingColon = [
  'UI_INVENTORY_FILTER_TYPE',
  'UI_INVENTORY_FILTER_NAME',
  'UI_INVENTORY_FILTER_CATEGORY',
  'MOVE_DESCRIPTION_POWER',
];

export const UIKeysReplace0Param = [
  'BATTLE_TOAST_AP', //
  'BATTLE_TOAST_RECORD_CHANCE',
];

export const UIKeysRemovePercent = [
  'BATTLE_TOAST_RECORD_CHANCE', //
];

export const UIKeysRemoveNewline = [
  'BATTLE_TOAST_RECORD_CHANCE', //
];

export const UIKeysRemovePeriod = [
  'UI_EVOLUTION_SPECIALIZATION', //
];
