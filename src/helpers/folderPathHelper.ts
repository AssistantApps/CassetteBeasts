import path from 'path';
import { getConfig } from 'services/internal/configService';

const dataPath = (folder: string) => path.join(getConfig().getUnpackedDir(), 'res', 'data', folder);
const spritePath = (folder: string) =>
  path.join(getConfig().getUnpackedDir(), 'res', 'sprites', folder);

export const FolderPathHelper = {
  translations: () => path.join(getConfig().getUnpackedDir(), 'res', 'translation'),
  dataFolder: () => dataPath(''),
  monsterForms: () => dataPath('monster_forms'),
  monsterFormsSecret: () => dataPath('monster_forms_secret'),
  monsterFormsUnlisted: () => dataPath('monster_forms_unlisted'),
  monsterSpriteAnim: () => spritePath('monsters'),
  monsterSpawn: () => dataPath('monster_spawn_profiles'),
  // monsterWorldSpriteAnim: () => path.join(spritePath('monsters'), 'world'),
  characters: () => dataPath('characters'),
  characterSpriteAnimBattle: () => path.join(spritePath('characters'), 'battle'),
  characterSpriteAnimWorld: () => path.join(spritePath('characters'), 'battle'),
  characterPortraits: () => spritePath('portraits'),
  characterSfx: () => dataPath('character_sfx'),
  elements: () => dataPath('elemental_types'),
  elementReactions: () => dataPath('elemental_reactions'),
  statusEffects: () => dataPath('status_effects'),
  moves: () => dataPath('battle_moves'),
  world: () => dataPath('map_metadata'),
  worldPier: () => path.join(dataPath('map_metadata'), 'pier'),
  worldMeta: (metaDataPath: string) => path.join(getConfig().getUnpackedDir(), 'res', metaDataPath),
  fusions: () => dataPath('fusions'),
  fusionSpriteAnim: () => spritePath('fusions'),
  fusionSpriteAnimSubFolder: (subFolder: string) => path.join(spritePath('fusions'), subFolder),
};
