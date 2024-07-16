import { IElementReaction } from 'contracts/elementReaction';
import { IExternalResource } from 'contracts/externalResource';
import { ISubAnimationResource } from 'contracts/subAnimationResource';
import { ISubResource } from 'contracts/subResource';
import { tryParseInt } from 'helpers/mathHelper';
import { getCleanedString, getStringArray } from 'helpers/stringHelper';
import { getExternalResource, getExternalResources } from 'mapper/externalResourceMapper';

export const elementReactionMapFromDetailList =
  (id: string) =>
  (props: {
    resourceMap: Record<string, string>;
    subResourceMap: Record<string, ISubResource>;
    externalResourcesMap: Record<number, IExternalResource>;
    subAnimationResourceMap: Record<number, ISubAnimationResource>;
  }): IElementReaction => {
    return {
      id,
      attacker: getExternalResource(
        props.resourceMap['attacker'], //
        props.externalResourcesMap,
      ),
      defender: getExternalResource(
        props.resourceMap['defender'], //
        props.externalResourcesMap,
      ),
      result: getExternalResources(
        props.resourceMap['result'], //
        props.externalResourcesMap,
      ),
      varied_result_amount: getStringArray(props.resourceMap['varied_result_amount']).map(
        tryParseInt,
      ),
      default_result_amount: tryParseInt(props.resourceMap['default_result_amount']),
      result_hint: tryParseInt(props.resourceMap['result_hint']),
      toast_message: getCleanedString(props.resourceMap['toast_message']),
    };
  };
