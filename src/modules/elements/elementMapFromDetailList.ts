import { IElement } from 'contracts/element';
import { IExternalResource } from 'contracts/externalResource';
import { ISubAnimationResource } from 'contracts/subAnimationResource';
import { ISubResource } from 'contracts/subResource';
import { tryParseInt } from 'helpers/mathHelper';
import { getCleanedString, stringToBool } from 'helpers/stringHelper';
import { getExternalResource } from 'mapper/externalResourceMapper';

export const elementMapFromDetailList = (props: {
  resourceMap: Record<string, string>;
  subResourceMap: Record<string, ISubResource>;
  externalResourcesMap: Record<number, IExternalResource>;
  subAnimationResourceMap: Record<number, ISubAnimationResource>;
}): IElement => {
  return {
    id: getCleanedString(props.resourceMap['id']),
    name: getCleanedString(props.resourceMap['name']),
    sort_order: tryParseInt(props.resourceMap['sort_order']),
    sparkle: stringToBool(props.resourceMap['sparkle']),
    icon: getExternalResource(
      props.resourceMap['icon'], //
      props.externalResourcesMap,
    ),
    loot_table: getCleanedString(props.resourceMap['loot_table']),
  };
};
