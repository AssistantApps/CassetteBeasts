import type { IExternalResource } from 'contracts/externalResource';
import type { IFusion } from 'contracts/fusion';
import { getExternalResource } from 'contracts/mapper/externalResourceMapper';
import type { INodeResource, INodeResourceEnhanced } from 'contracts/nodeResource';
import type { ISubAnimationResource } from 'contracts/subAnimationResource';
import type { ISubResource } from 'contracts/subResource';

export const fusionMapFromDetailList =
  (id: string) =>
  (props: {
    resourceMap: Record<string, string>;
    subResourceMap: Record<string, ISubResource>;
    externalResourcesMap: Record<number, IExternalResource>;
    subAnimationResourceMap: Record<number, ISubAnimationResource>;
    nodeResourceMap: Record<number, INodeResource>;
  }): IFusion => {
    return {
      id,
      nodes: mapNodes({
        externalResourcesMap: props.externalResourcesMap,
        nodeResourceMap: props.nodeResourceMap,
      }),
    };
  };

const mapNodes = (props: {
  externalResourcesMap: Record<string, IExternalResource>;
  nodeResourceMap: Record<string, INodeResource>;
}): Record<number, INodeResource> => {
  const result: Record<string, INodeResource> = {};

  for (const nodeKey of Object.keys(props.nodeResourceMap)) {
    const node: INodeResource = props.nodeResourceMap[nodeKey];
    const newNode: INodeResource = {
      ...node,
      instance_external: getExternalResource(node.instance ?? '', props.externalResourcesMap),
      child: mapNodes({
        externalResourcesMap: props.externalResourcesMap,
        nodeResourceMap: node.child ?? result,
      }) as Record<number, INodeResourceEnhanced>,
    };
    result[nodeKey] = newNode;
  }

  return result;
};
