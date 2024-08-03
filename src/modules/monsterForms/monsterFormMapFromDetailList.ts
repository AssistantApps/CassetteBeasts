import type { IExternalResource } from 'contracts/externalResource';
import type { IMonsterForm, IMonsterFormEnhanced } from 'contracts/monsterForm';
import type { IMove, IMoveEnhanced } from 'contracts/move';
import type { ISubAnimationResource } from 'contracts/subAnimationResource';
import type { ISubResource, ISubResourceMonsterEnhanced } from 'contracts/subResource';
import { tryParseInt } from 'helpers/mathHelper';
import {
  getCleanedString,
  getStringArray,
  resAndTresTrim,
  stringToBool,
} from 'helpers/stringHelper';
import { getExternalResource, getExternalResources } from 'mapper/externalResourceMapper';
import { getResources } from 'mapper/resourceMapper';
import type { CommonModule } from 'modules/commonModule';

export const monsterFormMapFromDetailList =
  (folder: string) =>
  (props: {
    resourceMap: Record<string, string>;
    subResourceMap: Record<string, ISubResource>;
    externalResourcesMap: Record<number, IExternalResource>;
    subAnimationResourceMap: Record<number, ISubAnimationResource>;
  }): IMonsterForm => {
    return {
      folder,
      name: getCleanedString(props.resourceMap['name']),
      battle_cry: getExternalResource(
        props.resourceMap['battle_cry'], //
        props.externalResourcesMap,
      ),
      elemental_types: getExternalResources(
        props.resourceMap['elemental_types'],
        props.externalResourcesMap,
      ),
      tape_sticker_texture: getExternalResource(
        props.resourceMap['tape_sticker_texture'],
        props.externalResourcesMap,
      ),
      exp_yield: tryParseInt(props.resourceMap['exp_yield']) ?? 0,
      require_dlc: getCleanedString(props.resourceMap['require_dlc']),
      battle_sprite_path: getCleanedString(props.resourceMap['battle_sprite_path']),
      ui_sprite_path: getCleanedString(props.resourceMap['ui_sprite_path']),
      pronouns: stringToBool(props.resourceMap['pronouns']),
      description: getCleanedString(props.resourceMap['description']),
      max_hp: tryParseInt(props.resourceMap['max_hp']) ?? 0,
      melee_attack: tryParseInt(props.resourceMap['melee_attack']) ?? 0,
      melee_defense: tryParseInt(props.resourceMap['melee_defense']) ?? 0,
      ranged_attack: tryParseInt(props.resourceMap['ranged_attack']) ?? 0,
      ranged_defense: tryParseInt(props.resourceMap['ranged_defense']) ?? 0,
      speed: tryParseInt(props.resourceMap['speed']) ?? 0,
      accuracy: tryParseInt(props.resourceMap['accuracy']) ?? 0,
      evasion: tryParseInt(props.resourceMap['evasion']) ?? 0,
      max_ap: tryParseInt(props.resourceMap['max_ap']) ?? 0,
      move_slots: tryParseInt(props.resourceMap['move_slots']) ?? 0,
      evolutions: getResources(
        props.resourceMap['evolutions'],
        props.externalResourcesMap,
        props.subResourceMap,
      ),
      evolution_specialization_question: getCleanedString(
        props.resourceMap['evolution_specialization_question'],
      ),
      capture_rate: tryParseInt(props.resourceMap['capture_rate']) ?? 0,
      exp_gradient: tryParseInt(props.resourceMap['exp_gradient']) ?? 0,
      exp_base_level: tryParseInt(props.resourceMap['exp_base_level']) ?? 0,
      move_tags: getStringArray(props.resourceMap['move_tags']),
      initial_moves: getExternalResources(
        props.resourceMap['initial_moves'],
        props.externalResourcesMap,
      ),
      tape_upgrades: getResources(
        props.resourceMap['tape_upgrades'],
        props.externalResourcesMap,
        props.subResourceMap,
      ),
      unlock_ability: getCleanedString(props.resourceMap['unlock_ability']),
      fusion_name_prefix: getCleanedString(props.resourceMap['fusion_name_prefix']),
      fusion_name_suffix: getCleanedString(props.resourceMap['fusion_name_suffix']),
      fusion_generator_path: getCleanedString(props.resourceMap['fusion_generator_path']),
      bestiary_index: tryParseInt(props.resourceMap['bestiary_index']) ?? 0,
      bestiary_category: tryParseInt(props.resourceMap['bestiary_category']) ?? 0,
      bestiary_bios: getStringArray(props.resourceMap['bestiary_bios']),
      bestiary_data_requirement: tryParseInt(props.resourceMap['bestiary_data_requirement']) ?? 0,
      loot_table: getCleanedString(props.resourceMap['loot_table']),
    };
  };

export const getEvolutionMonster = (
  language: Record<string, string>,
  resource: ISubResource,
  moveModule: CommonModule<IMove, IMoveEnhanced>,
  monsterDetails: IMonsterFormEnhanced,
): ISubResourceMonsterEnhanced | undefined => {
  if (monsterDetails == null) return;
  return {
    ...resource,
    icon_url: monsterDetails.icon_url,
    name_localised: monsterDetails.name_localised,
    bestiary_index_with_padding: monsterDetails.bestiary_index_with_padding,
    elemental_types_elements: monsterDetails.elemental_types_elements,
    required_move_move: moveModule.get(resAndTresTrim(resource?.required_move?.path ?? '')),
    specialization_localised: language[resource.specialization ?? ''],
  };
};
