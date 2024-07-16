import { IExternalResource } from 'contracts/externalResource';
import { ISubAnimationResource } from 'contracts/subAnimationResource';
import { ISubResource } from 'contracts/subResource';
import { IWorld, IWorldMetaData } from 'contracts/world';
import { getCleanedString } from 'helpers/stringHelper';
import { getExternalResource, getExternalResources } from 'mapper/externalResourceMapper';
import { getSubResource, getSubResources } from 'mapper/subResourceMapper';

export const worldMapFromDetailList =
  (id: string) =>
  (props: {
    resourceMap: Record<string, string>;
    subResourceMap: Record<string, ISubResource>;
    externalResourcesMap: Record<number, IExternalResource>;
    subAnimationResourceMap: Record<number, ISubAnimationResource>;
  }): IWorld => {
    return {
      id,
      title: getCleanedString(props.resourceMap['title']),
      map_texture: getExternalResource(
        props.resourceMap['map_texture'],
        props.externalResourcesMap,
      ),
      map_obscure: getExternalResource(
        props.resourceMap['map_obscure'],
        props.externalResourcesMap,
      ),
      map_background: getExternalResource(
        props.resourceMap['map_background'],
        props.externalResourcesMap,
      ),
      chunk_metadata_path: getCleanedString(props.resourceMap['chunk_metadata_path']),
      default_chunk_metadata: getSubResource(
        props.resourceMap['default_chunk_metadata'],
        props.subResourceMap,
      ),
      chunk_meta_data: {},
    };
  };

export const worldMetaDataMapFromDetailList = (props: {
  resourceMap: Record<string, string>;
  subResourceMap: Record<string, ISubResource>;
  externalResourcesMap: Record<number, IExternalResource>;
  subAnimationResourceMap: Record<number, ISubAnimationResource>;
}): IWorldMetaData => {
  return {
    title: getCleanedString(props.resourceMap['title']),
    features: getSubResources(
      props.resourceMap['features'], //
      props.subResourceMap,
    ).filter((s) => s != null),
  };
};
