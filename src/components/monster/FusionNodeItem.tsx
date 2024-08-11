import { createEffect, createSignal, type Component, type JSX } from 'solid-js';

import type { IFusionEnhanced } from 'contracts/fusion';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
import { UIKeys } from 'constants/localisation';
import { imgUrl } from 'helpers/urlHelper';
import { MonsterFusionDisplayHeading } from './MonsterFusionDisplayHeading';
import type { INodeResourceEnhanced } from 'contracts/nodeResource';
import type { ISpriteAnim } from 'contracts/spriteAnim';
import { getFileFromFilePath } from 'helpers/fileHelper';

interface IProps {
  fusionA?: INodeResourceEnhanced;
  fusionPartsListA: Record<string, INodeResourceEnhanced>;
  fusionB?: INodeResourceEnhanced;
  fusionSpriteMap: Record<string, ISpriteAnim>;
  sizeMultiplier?: number;
}

export const FusionNodeItem: Component<IProps> = (props: IProps) => {
  const sizeMultiplier = props.sizeMultiplier ?? 3;
  const fusionA = props.fusionA ?? ({} as INodeResourceEnhanced);
  const fusionB = props.fusionB ?? ({} as INodeResourceEnhanced);

  if (fusionA.visible == false && fusionB.visible == false) return undefined;

  const getSize = (
    fusionSpriteMap: Record<string, ISpriteAnim>,
    fusion: INodeResourceEnhanced,
  ): { width: string; height: string } => {
    let spriteItem = fusionSpriteMap[fusion.name];
    if (spriteItem == null) {
      const imgName = getFileFromFilePath(fusionA.instance_external_path).replace('.json', '');
      spriteItem = fusionSpriteMap[imgName];
    }
    const firstFrame = spriteItem?.animations?.[0]?.frames?.[0];

    return {
      width: firstFrame?.width != null ? firstFrame.width * sizeMultiplier + 'px' : 'unset',
      height: firstFrame?.height != null ? firstFrame.height * sizeMultiplier + 'px' : 'unset',
    };
  };

  const getAdjustedCoord = (orig: number): string => {
    return orig * sizeMultiplier + 'px';
  };

  const selectNode = (
    a: Record<string, INodeResourceEnhanced>,
    b: Record<string, INodeResourceEnhanced>,
    fusionKey: string,
  ) => {};

  const fusionPathA = fusionA.instance_external_path ?? '';
  const fusionAImg = imgUrl(fusionPathA.replace('.json', '.png'));
  if ((fusionAImg?.length ?? 0) == 0) return undefined;

  if (fusionA.parent.length != 0) {
    const parentA = props.fusionPartsListA[fusionA.parent];
    if (parentA != null) {
      if (parentA.visible == false) return undefined;
      fusionA.position.y = parentA.position.y;
      fusionA.position.x = parentA.position.x;
    }
  }

  return (
    <img
      id={fusionA.name}
      src={fusionAImg}
      alt={fusionA.name}
      class="fusion-node"
      style={{
        top: getAdjustedCoord(fusionA.position.y),
        left: getAdjustedCoord(fusionA.position.x),
        width: getSize(props.fusionSpriteMap, fusionA).width,
        height: getSize(props.fusionSpriteMap, fusionA).height,
        'z-index': fusionA.index ?? 0,
      }}
    />
  );
};
