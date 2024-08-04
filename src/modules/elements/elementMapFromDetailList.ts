import type { IElement } from 'contracts/element';
import type { IExternalResource } from 'contracts/externalResource';
import { getExternalResource } from 'contracts/mapper/externalResourceMapper';
import type { ISubAnimationResource } from 'contracts/subAnimationResource';
import type { ISubResource } from 'contracts/subResource';
import { tryParseInt } from 'helpers/mathHelper';
import { getCleanedString, stringToBool } from 'helpers/stringHelper';

export const elementMapFromDetailList = (props: {
  resourceMap: Record<string, string>;
  subResourceMap: Record<string, ISubResource>;
  externalResourcesMap: Record<number, IExternalResource>;
  subAnimationResourceMap: Record<number, ISubAnimationResource>;
}): IElement => {
  return {
    id: getCleanedString(props.resourceMap['id']),
    name: getCleanedString(props.resourceMap['name']),
    sort_order: tryParseInt(props.resourceMap['sort_order']) ?? 0,
    sparkle: stringToBool(props.resourceMap['sparkle']),
    icon: getExternalResource(
      props.resourceMap['icon'], //
      props.externalResourcesMap,
    ),
    loot_table: getCleanedString(props.resourceMap['loot_table']),
  };
};
