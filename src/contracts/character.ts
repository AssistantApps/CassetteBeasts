import { IElement } from './element';
import { IExternalResource } from './externalResource';
import { IMonsterFormSimplified } from './monsterForm';
import { ISpriteAnimDetailsEnhanced } from './spriteAnim';
import { ISubResource } from './subResource';

export interface ICharacter {
  id: string;
  name: string;
  resource_name: string;
  //   swap_colors: string;
  //   default_palette: string;
  //   emission_palette: string;
  //   named_positions: string;
  //   elemental_types: string;
  exp_yield: number;
  require_dlc: boolean;
  battle_sprite: IExternalResource;
  character_kind: number;
  force_unrecordable: boolean;
  human_colors: string;
  // human_part_names: string;
  level: number;
  // pronouns: number;
  max_ap: number;
  ap_regen: number;
  max_hp: number;
  melee_attack: number;
  melee_defense: number;
  ranged_attack: number;
  ranged_defense: number;
  speed: number;
  accuracy: number;
  evasion: number;
  tapes: Array<ISubResource>;
  team_name_override: string;
  exp_gradient: number;
  exp_base_level: number;
  partner_id: string;
  partner_signature_species: IExternalResource;
  partner_signature_species_type_override?: IExternalResource;
  sfx: IExternalResource;
  // 'human_part_names/body': string;
  // 'human_part_names/arms': string;
  // 'human_part_names/hair': string;
  // 'human_part_names/head': string;
  // 'human_part_names/legs': string;
  // 'human_part_names/wings': string;
  // 'human_colors/body_color_1': number;
  // 'human_colors/body_color_2': number;
  // 'human_colors/eye_color': number;
  // 'human_colors/face_accessory_color': number;
  // 'human_colors/favorite_color': number;
  // 'human_colors/hair_accessory_color': number;
  // 'human_colors/hair_color': number;
  // 'human_colors/legs_color': number;
  // 'human_colors/shoe_color': number;
  // 'human_colors/skin_color': number;
  portraits: Array<string>;
}

export interface ICharacterEnhanced extends ICharacter {
  name_localised: string;
  battle_sprite_path: string;
  sprite_sheet_path: string;
  icon_url: string;
  meta_image_url: string;
  partner_image_url: string;
  // tapes_monsters: Array<IMonsterForm>;
  portraits: Array<string>;
  partner_signature_species_monsters: IMonsterFormSimplified;
  partner_signature_species_tape_sticker_texture: string;
  partner_signature_species_elemental_types_elements: string;
  partner_signature_species_type_override_element?: IElement;
  animations: Array<ISpriteAnimDetailsEnhanced>;
  audioFiles: Array<ICharacterSfxFiles>;
}

export interface ICharacterSfx {
  file: string;
  windup: Array<IExternalResource>;
  hurt: Array<IExternalResource>;
  recording: Array<IExternalResource>;
  recording_success: Array<IExternalResource>;
  recording_failure: Array<IExternalResource>;
  transform: Array<IExternalResource>;
  defeat: Array<IExternalResource>;
  greeting: Array<IExternalResource>;
  farewell: Array<IExternalResource>;
  thanks: Array<IExternalResource>;
  sigh_2: Array<IExternalResource>;
  surprise_2: Array<IExternalResource>;
  thinking: Array<IExternalResource>;
  audioFiles: Array<ICharacterSfxFiles>;
}

export interface ICharacterSfxFiles {
  name: string;
  files: Array<ICharacterSfxFile>;
}

export interface ICharacterSfxFile {
  url: string;
  autoplay: boolean;
}
