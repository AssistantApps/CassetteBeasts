import type { ICharacterSfx } from 'contracts/character';
import type { IExternalResource } from 'contracts/externalResource';
import type { ISubAnimationResource } from 'contracts/subAnimationResource';
import type { ISubResource } from 'contracts/subResource';
import { getExternalResources } from 'mapper/externalResourceMapper';

export const characterSfxMapFromDetailList =
  (file: string) =>
  (props: {
    resourceMap: Record<string, string>;
    subResourceMap: Record<string, ISubResource>;
    externalResourcesMap: Record<number, IExternalResource>;
    subAnimationResourceMap: Record<number, ISubAnimationResource>;
  }): ICharacterSfx => {
    return {
      file,
      windup: getExternalResources(props.resourceMap['windup'], props.externalResourcesMap),
      hurt: getExternalResources(props.resourceMap['hurt'], props.externalResourcesMap),
      recording: getExternalResources(props.resourceMap['recording'], props.externalResourcesMap),
      recording_success: getExternalResources(
        props.resourceMap['recording_success'],
        props.externalResourcesMap,
      ),
      recording_failure: getExternalResources(
        props.resourceMap['recording_failure'],
        props.externalResourcesMap,
      ),
      transform: getExternalResources(props.resourceMap['transform'], props.externalResourcesMap),
      defeat: getExternalResources(props.resourceMap['defeat'], props.externalResourcesMap),
      greeting: getExternalResources(props.resourceMap['greeting'], props.externalResourcesMap),
      farewell: getExternalResources(props.resourceMap['farewell'], props.externalResourcesMap),
      thanks: getExternalResources(props.resourceMap['thanks'], props.externalResourcesMap),
      sigh_2: getExternalResources(props.resourceMap['sigh_2'], props.externalResourcesMap),
      surprise_2: getExternalResources(props.resourceMap['surprise_2'], props.externalResourcesMap),
      thinking: getExternalResources(props.resourceMap['thinking'], props.externalResourcesMap),
      audioFiles: [],
    };
  };
