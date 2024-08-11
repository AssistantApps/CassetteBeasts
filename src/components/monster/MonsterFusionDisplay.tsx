import { createEffect, createSignal, Show, type Component, type JSX } from 'solid-js';

import type { IFusionEnhanced } from 'contracts/fusion';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
import { UIKeys } from 'constants/localisation';
import { imgUrl } from 'helpers/urlHelper';
import { MonsterFusionDisplayHeading } from './MonsterFusionDisplayHeading';
import { FusionNodeItem } from './FusionNodeItem';
import type { ISpriteAnim } from 'contracts/spriteAnim';

interface IProps {
  translate: Record<string, string>;
  itemMap: Record<string, IFusionEnhanced>;
  fusionSpriteMap: Record<string, ISpriteAnim>;
  monsterA?: IMonsterFormDropdown;
  monsterB?: IMonsterFormDropdown;
}

export const MonsterFusionDisplay: Component<IProps> = (props: IProps) => {
  const [monsterAFusionMap, setMonsterAFusionMap] = createSignal<IFusionEnhanced>();
  const [monsterBFusionMap, setMonsterBFusionMap] = createSignal<IFusionEnhanced>();
  const [maxImgHeight, setMaxImgHeight] = createSignal<number>(0);
  const [sizeMultiplier, setSizeMultiplier] = createSignal<number>(1);

  createEffect(() => {
    const fusionA = props.itemMap[props.monsterA?.id ?? ''];
    if (fusionA != null) {
      setMonsterAFusionMap(fusionA);
    }

    const fusionB = props.itemMap[props.monsterB?.id ?? ''];
    if (fusionB != null) {
      setMonsterBFusionMap(fusionB);
    }

    let maxH = 0;
    let maxW = 0;
    for (const sprite of Object.values(props.fusionSpriteMap)) {
      const firstFrame = sprite.animations[0].frames[0];
      if (firstFrame.height > maxH) {
        maxH = firstFrame.height;
      }
      if (firstFrame.width > maxW) {
        maxW = firstFrame.width;
      }
    }
    const sizeH = screen.availHeight / 2.5 / maxH;
    const sizeW = screen.availWidth / 2.5 / maxW;
    const sizeM = Math.min(sizeH, sizeW);
    setMaxImgHeight(maxH);
    setSizeMultiplier(sizeM);
  }, [props.monsterA?.id, props.monsterB?.id]);

  return (
    <>
      <MonsterFusionDisplayHeading
        translate={props.translate}
        monsterA={props.monsterA}
        monsterB={props.monsterB}
      />
      <div id={monsterAFusionMap()?.id} class="fusion-container">
        <Show
          when={monsterAFusionMap() != null && monsterBFusionMap() != null}
          fallback={<h1>?</h1>}
        >
          <div
            class="fusion-item"
            style={{
              height: sizeMultiplier() * maxImgHeight() + 'px',
              width: sizeMultiplier() * maxImgHeight() + 'px',
            }}
          >
            {Object.values(monsterAFusionMap()?.nodes_enhanced ?? {}).map((node) => (
              <FusionNodeItem
                fusionSpriteMap={props.fusionSpriteMap}
                fusionA={node}
                fusionPartsListA={monsterAFusionMap()?.nodes_enhanced ?? {}}
                fusionB={node}
                sizeMultiplier={sizeMultiplier()}
              />
            ))}
          </div>
        </Show>
      </div>
    </>
  );
};
