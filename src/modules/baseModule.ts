import fs from 'fs';
import path from 'path';
import readline from 'readline';

import { tresSeparator } from 'constant/tresSeparator';
import { IExternalResource } from 'contracts/externalResource';
import { INodeResource } from 'contracts/nodeResource';
import { ISubAnimationResource } from 'contracts/subAnimationResource';
import { ISubResource } from 'contracts/subResource';
import { stringStartsWith } from 'helpers/stringHelper';
import { externalResourceMapper } from 'mapper/externalResourceMapper';
import { nodeResourceFromDetailList, nodeResourceHeadMapper } from 'mapper/nodeResourceMapper';
import { subAnimResourceFromDetailList, subAnimResourceMapper } from 'mapper/subAnimResourceMapper';
import { subResourceFromDetailList, subResourceMapper } from 'mapper/subResourceMapper';

export const getItemFromMapByIntId =
  <T>(mapItemDetailMap: Record<number, T>) =>
  (id: string) => {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      const errMsg = `Id '${id}' is not valid`;
      console.error(errMsg);
      throw errMsg;
    }

    return mapItemDetailMap[id];
  };

type ItemDetailType<T> = {
  folder: string;
  fileName: string;
  mapFromDetailList: (props: {
    resourceMap: Record<string, string>;
    subResourceMap: Record<string, ISubResource>;
    externalResourcesMap: Record<number, IExternalResource>;
    subAnimationResourceMap: Record<number, ISubAnimationResource>;
    nodeResourceMap: Record<number, INodeResource>;
  }) => T;
};

export const readItemDetail = async <T>(props: ItemDetailType<T>): Promise<T> => {
  const filePath = path.join(props.folder, props.fileName);
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let monsterDetailMap: Record<string, string> = {};
  let subResourceMapItem: Record<string, string> = {};
  let subResourceMap: Record<string, ISubResource> = {};
  let subAnimationResourceMapItem: Record<string, string> = {};
  let subAnimationResourceMap: Record<string, ISubAnimationResource> = {};
  let nodeResourceMapItem: Record<string, string> = {};
  let nodeResourceMap: Record<string, INodeResource> = {};
  let externalResourcesMap: Record<number, IExternalResource> = {};

  let mode: 'none' | 'resource' | 'subResource' | 'subAnimResource' | 'node' = 'none';
  let previousKey = '';
  for await (const line of rl) {
    let isExternalResource = false;
    let isSubResourceSection = false;
    let isSubAnimResourceSection = false;
    let isResourceSection = false;
    let isNodeSection = false;

    if (mode == 'none') {
      isExternalResource = stringStartsWith(tresSeparator.externalResource, line);
      isSubResourceSection = stringStartsWith(tresSeparator.subResource, line);
      isResourceSection = stringStartsWith(tresSeparator.resource, line);
      isNodeSection = stringStartsWith(tresSeparator.node, line);

      isSubAnimResourceSection = stringStartsWith(tresSeparator.subAnimResource, line);
      if (isSubAnimResourceSection) isSubResourceSection = false;
    }

    if (isExternalResource) {
      const externalResource = externalResourceMapper(line);
      if (externalResource != null) {
        externalResourcesMap[externalResource.id] = externalResource;
      }
      continue;
    }

    if (mode == 'subResource') {
      if (line.includes(' = ')) {
        const [key, value] = line.split(' = ');
        subResourceMapItem[key] = value;
        previousKey = key;
      }
      if (line.length < 1) {
        const mappedSubResource = subResourceFromDetailList({
          subResourceMapItem,
          externalResourcesMap,
        });
        subResourceMap[mappedSubResource.id] = mappedSubResource;
        mode = 'none';
      }
      continue;
    }
    if (isSubResourceSection) {
      const subResource = subResourceMapper(line);
      if (subResource != null) {
        subResourceMapItem = { ...(subResource as any) };
      }
      mode = 'subResource';
      continue;
    }

    if (mode == 'subAnimResource') {
      if (line.includes(' = ')) {
        const [key, value] = line.split(' = ');
        subAnimationResourceMapItem[key] = value;
        previousKey = key;
      } else {
        subAnimationResourceMapItem[previousKey] =
          subAnimationResourceMapItem[previousKey] + '\n' + line;
      }
      if (line.length < 1) {
        const mappedSubResource = subAnimResourceFromDetailList({
          subAnimationResourceMapItem,
        });
        subAnimationResourceMap[mappedSubResource.id] = mappedSubResource;
        mode = 'none';
      }
      continue;
    }
    if (isSubAnimResourceSection) {
      const subAnimResource = subAnimResourceMapper(line);
      if (subAnimResource != null) {
        subAnimationResourceMapItem = { ...(subAnimResource as any) };
      }
      mode = 'subAnimResource';
      continue;
    }

    if (mode == 'node') {
      if (line.includes(' = ')) {
        const [key, value] = line.split(' = ');
        nodeResourceMapItem[key] = value;
        previousKey = key;
      } else {
        nodeResourceMapItem[previousKey] = nodeResourceMapItem[previousKey] + '\n' + line;
      }
      if (line.length < 1) {
        if (nodeResourceMapItem['name'] != null) {
          const mappedNodeResource = nodeResourceFromDetailList({
            nodeResourceMapItem,
            externalResourcesMap,
          });
          let key = mappedNodeResource.name;
          if (mappedNodeResource.type == 'sub') {
            key = mappedNodeResource.name + '_' + mappedNodeResource.parent;
          }
          nodeResourceMap[key] = mappedNodeResource;
        }
        mode = 'none';
      }
      continue;
    }
    if (isNodeSection) {
      const nodeResource = nodeResourceHeadMapper(line);
      if (nodeResource != null) {
        nodeResourceMapItem = { ...(nodeResource as any) };
      }
      mode = 'node';
      continue;
    }

    if (mode == 'resource') {
      if (line.includes(' = ')) {
        const [key, value] = line.split(' = ');
        monsterDetailMap[key] = value;
        previousKey = key;
      } else {
        monsterDetailMap[previousKey] = monsterDetailMap[previousKey] + line;
      }
    }
    if (isResourceSection) {
      mode = 'resource';
    }
  }

  return props.mapFromDetailList({
    resourceMap: monsterDetailMap,
    subResourceMap: subResourceMap,
    externalResourcesMap: externalResourcesMap,
    subAnimationResourceMap: subAnimationResourceMap,
    nodeResourceMap: nodeResourceMap,
  });
};
