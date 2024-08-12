import { type Component } from 'solid-js';

import type { INodeResourceEnhanced } from 'contracts/nodeResource';
import type { ISpriteAnim } from 'contracts/spriteAnim';
import { getFileFromFilePath } from 'helpers/fileHelper';
import { imgUrl } from 'helpers/urlHelper';

interface IProps {
  fusion?: INodeResourceEnhanced;
  fusionPartsList: Record<string, INodeResourceEnhanced>;
  fusionSpriteMap: Record<string, ISpriteAnim>;
  sizeMultiplier?: number;
}

export const MonsterFusionNodeItem: Component<IProps> = (props: IProps) => {
  const sizeMultiplier = props.sizeMultiplier ?? 3;
  const fusion = props.fusion ?? ({} as INodeResourceEnhanced);

  if (fusion.visible == false) return undefined;

  const getSize = (
    fusionSpriteMap: Record<string, ISpriteAnim>,
    fusion: INodeResourceEnhanced,
  ): { width: string; height: string } => {
    let spriteItem = fusionSpriteMap[fusion.name];
    if (spriteItem == null) {
      const imgName = getFileFromFilePath(fusion.instance_external_path ?? '').replace('.json', '');
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

  const getFusionItemSrc = (item: INodeResourceEnhanced): string | undefined => {
    const fusionPathA = item.instance_external_path ?? '';
    const fusionAImg = imgUrl(fusionPathA.replace('.json', '.png'));
    if ((fusionAImg?.length ?? 0) == 0) return undefined;
    return fusionAImg;
  };

  const getMappedFusionItem = (
    item: INodeResourceEnhanced,
    partsList: Record<string, INodeResourceEnhanced>,
  ): INodeResourceEnhanced | undefined => {
    if (item == null) return undefined;
    const result = { ...item };

    if ((result?.parent?.length ?? 0) != 0) {
      const parentA = partsList[result.parent];
      if (parentA != null) {
        if (parentA.visible == false) return undefined;
        result.position.y = parentA.position.y;
        result.position.x = parentA.position.x;
      }
    }
    return result;
  };

  const resultFusion = getMappedFusionItem(fusion, props.fusionPartsList);
  if (resultFusion == null) return undefined;

  const resultFusionImg = getFusionItemSrc(resultFusion);
  if (resultFusionImg == null) return undefined;

  return (
    <img
      id={resultFusion.name}
      src={resultFusionImg}
      alt={resultFusion.name}
      class="fusion-node"
      style={{
        top: getAdjustedCoord(resultFusion.position.y),
        left: getAdjustedCoord(resultFusion.position.x),
        width: getSize(props.fusionSpriteMap, resultFusion).width,
        height: getSize(props.fusionSpriteMap, resultFusion).height,
        'z-index': resultFusion.index ?? 0,
      }}
    />
  );
};
