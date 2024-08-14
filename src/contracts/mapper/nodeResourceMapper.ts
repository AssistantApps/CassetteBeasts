import type { IExternalResource } from 'contracts/externalResource';
import type {
  INodeResource,
  INodeResourceEnhanced,
  INodeResourceHead,
} from 'contracts/nodeResource';
import { tryParseVector2D } from 'helpers/mathHelper';
import { stringToBoolWithDefault, stringToParent } from 'helpers/stringHelper';

export const nodeResourceHeadMapper = (line: string): INodeResourceHead | undefined => {
  const regexBasicLine = /\sname=\"(.+?)\"\stype=\"(.+?)\"\sparent=\"(.+?)\"/;
  const matchesBasicLine = regexBasicLine.exec(line);
  if ((matchesBasicLine?.length ?? 0) == 4) {
    return {
      name: matchesBasicLine![1],
      type: matchesBasicLine![2],
      parent: matchesBasicLine![3],
    };
  }
  const regexWithInstance = /\sname=\"(.+?)\"\sparent=\"(.+?)\"\sinstance=(.+?\))/;
  const matchesWithInstance = regexWithInstance.exec(line);
  if ((matchesWithInstance?.length ?? 0) == 4) {
    return {
      name: matchesWithInstance![1],
      type: 'sub',
      parent: matchesWithInstance![2],
      instance: matchesWithInstance![3],
    };
  }
};

export const nodeResourceFromDetailList = (props: {
  nodeResourceMapItem: Record<string, string>;
  externalResourcesMap: Record<number, IExternalResource>;
}): INodeResource => {
  return {
    name: props.nodeResourceMapItem['name'],
    type: props.nodeResourceMapItem['type'],
    parent: props.nodeResourceMapItem['parent'],

    instance: props.nodeResourceMapItem['instance'],
    force_usage: stringToBoolWithDefault(props.nodeResourceMapItem['force_usage'], false),
    inverse_match: stringToBoolWithDefault(props.nodeResourceMapItem['inverse_match'], false),
    visible: stringToBoolWithDefault(props.nodeResourceMapItem['visible'], true),
    position: tryParseVector2D(props.nodeResourceMapItem['position'])!,
    match_part: stringToParent(props.nodeResourceMapItem['match_part']),
    child: {},
  };
};

export const mapNodeResourceFromFlatMap = (
  nodeResourceMap: Record<string, INodeResourceEnhanced>,
): Record<string, INodeResourceEnhanced> => {
  const result: Record<string, INodeResourceEnhanced> = {};

  for (const mapKey of Object.keys(nodeResourceMap)) {
    const item: INodeResourceEnhanced = nodeResourceMap[mapKey];
    if (item.type == 'sub') continue;
    if ((item.match_part ?? '').length > 0) continue;
    // parents without match_part
    result[mapKey] = item;
  }
  for (const mapKey of Object.keys(nodeResourceMap)) {
    const item: INodeResourceEnhanced = nodeResourceMap[mapKey];
    if (item.type == 'sub') continue;
    if ((item.match_part ?? '').length < 1) continue;
    // parents with match_part
    if (result[item.match_part] == null) {
      console.error(`parents with match_part does not exist ${item.match_part}`);
      continue;
    }
    const match_part = item.match_part ?? '';
    if (result[match_part].child == null) {
      result[match_part].child = {};
    }
    result[match_part].child[mapKey] = item;
  }

  for (const mapKey of Object.keys(nodeResourceMap)) {
    const item: INodeResourceEnhanced = nodeResourceMap[mapKey];
    if (item.type != 'sub') continue;
    // subs

    if (result[item.parent] != null) {
      const parent = item.parent ?? '';
      if (result[parent].child == null) {
        result[parent].child = {};
      }
      result[parent].child[mapKey] = item;
      continue;
    }

    const parentItem: INodeResourceEnhanced = nodeResourceMap[item.parent];
    if (parentItem.match_part?.length < 1) continue;
    if (result[parentItem.match_part] == null) {
      console.error(`sub parent does not exist ${item.parent}`);
      continue;
    }
    const match_part = parentItem.match_part ?? '';
    if (result[match_part].child == null) {
      result[match_part].child = {};
    }
    result[match_part].child[mapKey] = item;
  }

  return result;
};
