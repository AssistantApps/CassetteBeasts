import { IExternalResource } from 'contracts/externalResource';
import { IFusion } from 'contracts/fusion';
import { INodeResource } from 'contracts/nodeResource';
import { ISubAnimationResource } from 'contracts/subAnimationResource';
import { ISubResource } from 'contracts/subResource';
import { getExternalResource } from 'mapper/externalResourceMapper';

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
  externalResourcesMap: Record<number, IExternalResource>;
  nodeResourceMap: Record<number, INodeResource>;
}): Record<number, INodeResource> => {
  const result: Record<number, INodeResource> = {};

  for (const nodeKey of Object.keys(props.nodeResourceMap)) {
    const node: INodeResource = props.nodeResourceMap[nodeKey];
    const newNode: INodeResource = {
      ...node,
      instance_external: getExternalResource(node.instance, props.externalResourcesMap),
      child: mapNodes({
        externalResourcesMap: props.externalResourcesMap,
        nodeResourceMap: node.child,
      }),
    };
    result[nodeKey] = newNode;
  }

  return result;
};
