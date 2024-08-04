import type { IExternalResource } from 'contracts/externalResource';
import { getExternalResources } from 'contracts/mapper/externalResourceMapper';
import type { IMove } from 'contracts/move';
import type { ISubAnimationResource } from 'contracts/subAnimationResource';
import type { ISubResource } from 'contracts/subResource';
import { tryParseInt } from 'helpers/mathHelper';
import { getCleanedString, getStringArray, stringToBool } from 'helpers/stringHelper';

export const moveMapFromDetailList =
  (id: string) =>
  (props: {
    resourceMap: Record<string, string>;
    subResourceMap: Record<string, ISubResource>;
    externalResourcesMap: Record<number, IExternalResource>;
    subAnimationResourceMap: Record<number, ISubAnimationResource>;
  }): IMove => {
    return {
      id,
      name: getCleanedString(props.resourceMap['name']),
      category_name: getCleanedString(props.resourceMap['category_name']),
      description: getCleanedString(props.resourceMap['description']),
      title_override: getCleanedString(props.resourceMap['title_override']),
      tags: getStringArray(props.resourceMap['tags']),
      priority: tryParseInt(props.resourceMap['priority'])!,
      cost: tryParseInt(props.resourceMap['cost'])!,
      is_passive_only: stringToBool(props.resourceMap['is_passive_only']),
      power: tryParseInt(props.resourceMap['power'])!,
      physicality: tryParseInt(props.resourceMap['physicality'])!,
      target_type: tryParseInt(props.resourceMap['target_type'])!,
      default_target: tryParseInt(props.resourceMap['default_target'])!,
      elemental_types: getExternalResources(
        props.resourceMap['elemental_types'], //
        props.externalResourcesMap,
      ),
      accuracy: tryParseInt(props.resourceMap['accuracy'])!,
      unavoidable: stringToBool(props.resourceMap['unavoidable']),
      crit_rate_numerator: tryParseInt(props.resourceMap['crit_rate_numerator'])!,
      crit_rate_denominator: tryParseInt(props.resourceMap['crit_rate_denominator'])!,
      crit_damage_percent: tryParseInt(props.resourceMap['crit_damage_percent'])!,
      attack_duration: tryParseInt(props.resourceMap['attack_duration'])!,
      hit_delay: tryParseInt(props.resourceMap['hit_delay'])!,
      disable_melee_movement: stringToBool(props.resourceMap['disable_melee_movement']),
      can_be_copied: stringToBool(props.resourceMap['can_be_copied']),
      status_effects: getExternalResources(
        props.resourceMap['status_effects'], //
        props.externalResourcesMap,
      ),
      amount: tryParseInt(props.resourceMap['amount'])!,
      status_effects_to_apply: tryParseInt(props.resourceMap['status_effects_to_apply'])!,
      num_at_random: tryParseInt(props.resourceMap['num_at_random'])!,
      fail_if_already_present: stringToBool(props.resourceMap['fail_if_already_present']),
      fail_against_archangels: stringToBool(props.resourceMap['fail_against_archangels']),
      fail_if_has_tag: getCleanedString(props.resourceMap['fail_if_has_tag']),
      sacrifice_hp_percent: tryParseInt(props.resourceMap['sacrifice_hp_percent'])!,
      chance: tryParseInt(props.resourceMap['chance'])!,
    };
  };
