import type { IExternalResource } from 'contracts/externalResource';
import type { IStatusEffect } from 'contracts/statusEffect';
import type { ISubAnimationResource } from 'contracts/subAnimationResource';
import type { ISubResource } from 'contracts/subResource';
import { tryParseInt } from 'helpers/mathHelper';
import { getCleanedString, getStringArray, stringToBool } from 'helpers/stringHelper';
import { getExternalResource } from 'mapper/externalResourceMapper';

export const statusEffectMapFromDetailList =
  (id: string) =>
  (props: {
    resourceMap: Record<string, string>;
    subResourceMap: Record<string, ISubResource>;
    externalResourcesMap: Record<number, IExternalResource>;
    subAnimationResourceMap: Record<number, ISubAnimationResource>;
  }): IStatusEffect => {
    return {
      id,
      name: getCleanedString(props.resourceMap['name']),
      description: getCleanedString(props.resourceMap['description']),
      has_duration: stringToBool(props.resourceMap['has_duration']),
      reduce_duration_at: tryParseInt(props.resourceMap['reduce_duration_at'])!,
      icon: getExternalResource(
        props.resourceMap['icon'], //
        props.externalResourcesMap,
      ),
      is_removable: stringToBool(props.resourceMap['is_removable']),
      is_buff: stringToBool(props.resourceMap['is_buff']),
      is_debuff: stringToBool(props.resourceMap['is_debuff']),
      is_decoy: stringToBool(props.resourceMap['is_decoy']),
      always_hidden_from_display: stringToBool(props.resourceMap['always_hidden_from_display']),
      tags: getStringArray(props.resourceMap['tags']),
      toast_on_remove: getCleanedString(props.resourceMap['toast_on_remove']),
      name_modifier: getCleanedString(props.resourceMap['name_modifier']),
      sprite_animation_prefix: getCleanedString(props.resourceMap['sprite_animation_prefix']),
      sprite_animation_prefix_priority: getCleanedString(
        props.resourceMap['sprite_animation_prefix_priority'],
      ),
      stats_affected: getStringArray(props.resourceMap['stats_affected']),
      stat_offset: tryParseInt(props.resourceMap['stat_offset'])!,
    };
  };
