import type { IElementReaction } from 'contracts/elementReaction';
import type { IExternalResource } from 'contracts/externalResource';
import type { ISubAnimationResource } from 'contracts/subAnimationResource';
import type { ISubResource } from 'contracts/subResource';
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
        (a) => tryParseInt(a)!,
      ),
      default_result_amount: tryParseInt(props.resourceMap['default_result_amount']) ?? 0,
      result_hint: tryParseInt(props.resourceMap['result_hint']) ?? 0,
      toast_message: getCleanedString(props.resourceMap['toast_message']),
    };
  };
