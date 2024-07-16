import { IExternalResource } from 'contracts/externalResource';
import { ISpriteAnim, ISpriteAnimDetails } from 'contracts/spriteAnim';
import { ISubAnimationResource } from 'contracts/subAnimationResource';
import { ISubResource } from 'contracts/subResource';

export const spriteAnimMapFromDetailList =
  (name: string) =>
  (props: {
    resourceMap: Record<string, string>;
    subResourceMap: Record<string, ISubResource>;
    externalResourcesMap: Record<number, IExternalResource>;
    subAnimationResourceMap: Record<number, ISubAnimationResource>;
  }): ISpriteAnim => {
    let animations: Array<ISpriteAnimDetails> = [];
    for (const subAnimResourceKey of Object.keys(props.subAnimationResourceMap)) {
      const subAnimResource: ISubAnimationResource =
        props.subAnimationResourceMap[subAnimResourceKey];
      if (subAnimResource.type != 'Animation') continue;

      animations.push({
        id: subAnimResource.id,
        loop: subAnimResource.loop,
        length: subAnimResource.length,
        frames: subAnimResource.sprite_frame_coords,
      });
    }

    return {
      name,
      animations,
    };
  };
