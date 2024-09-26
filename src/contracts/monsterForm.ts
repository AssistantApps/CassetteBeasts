import type { IElementEnhanced } from './element';
import type { IExternalResource } from './externalResource';
import type { IMonsterSpawnHabitatDetails } from './monsterSpawn';
import type { IMoveEnhanced, IMoveSimplified } from './move';
import type { ISpriteAnimDetailsEnhanced } from './spriteAnim';
import type { ISubResource, ISubResourceMonsterEnhanced } from './subResource';

export interface IMonsterForm {
  name: string;
  //   swap_colors: string;
  //   default_palette: string;
  //   emission_palette: string;
  battle_cry?: IExternalResource;
  //   named_positions: string;
  folder: string;
  elemental_types?: Array<IExternalResource>;
  tape_sticker_texture?: IExternalResource;
  exp_yield: number;
  require_dlc: string;
  battle_sprite_path: string;
  ui_sprite_path: string;
  pronouns: boolean;
  description: string;
  max_hp: number;
  melee_attack: number;
  melee_defense: number;
  ranged_attack: number;
  ranged_defense: number;
  speed: number;
  accuracy: number;
  evasion: number;
  max_ap: number;
  move_slots: number;
  evolutions: Array<IExternalResource | ISubResource>;
  evolution_specialization_question: string;
  capture_rate: number;
  exp_gradient: number;
  exp_base_level: number;
  move_tags: Array<string>;
  initial_moves?: Array<IExternalResource>;
  tape_upgrades?: Array<IExternalResource | ISubResource>;
  unlock_ability: string;
  fusion_name_prefix: string;
  fusion_name_suffix: string;
  fusion_generator_path: string;
  bestiary_index: number;
  bestiary_category: number;
  bestiary_bios: Array<string>;
  bestiary_data_requirement: number;
  loot_table: string;
}

export interface IMonsterFormEnhanced extends IMonsterForm {
  id: string;
  imageId: number;
  resource_name: string;
  name_localised: string;
  description_localised: string;
  sprite_sheet_path: string;
  icon_url: string;
  meta_image_url: string;
  evolutions_monster: Array<ISubResourceMonsterEnhanced>;
  evolution_from_monster?: ISubResourceMonsterEnhanced;
  total_evolutions: number;
  bestiary_index_with_padding: string;
  evolution_specialization_question_localised: string;
  fusion_name_prefix_localised: string;
  fusion_name_suffix_localised: string;
  bestiary_bios_localised: Array<string>;
  elemental_types_elements: Array<IElementEnhanced>;
  initial_moves_moves: Array<IMoveEnhanced>;
  tape_upgrades_moves: Array<IMoveEnhanced>;
  animations: Array<ISpriteAnimDetailsEnhanced>;
  learnable_moves: Array<IMoveSimplified>;
  unlock_ability_localised: string;
  battle_cry_audio_url?: string;
  isSecret: boolean;
  spawn_overworld_locations: Array<IMonsterSpawnHabitatDetails>;
  spawn_backup_locations: Array<IMonsterSpawnHabitatDetails>;
  has_locations: boolean;
}

export interface IMonsterFormSimplified {
  id: string;
  name_localised: string;
  resource_name: string;
  icon_url: string;
  source?: string;
  isSecret: boolean;
  bestiary_index: number;
  bestiary_index_with_padding: string;
}

export interface IMonsterFormMoveSource {
  monster_id: string;
  source: string;
}

export interface IMonsterFormDropdown {
  id: string;
  name: string;
  icon: string;
  bestiary_index: number;
  prefix: string;
  suffix: string;
}
