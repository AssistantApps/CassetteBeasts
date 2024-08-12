import { createEffect, createSignal, Show, type Component } from 'solid-js';

import type { IFusionEnhanced } from 'contracts/fusion';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
import type { ISpriteAnim } from 'contracts/spriteAnim';
import { MonsterFusionDisplayHeading } from './MonsterFusionDisplayHeading';
import { MonsterFusionNodeItem } from './MonsterFusionNodeItem';
import type { INodeResourceEnhanced } from 'contracts/nodeResource';

interface IProps {
  translate: Record<string, string>;
  itemMap: Record<string, IFusionEnhanced>;
  fusionSpriteMap: Record<string, ISpriteAnim>;
  monsterA?: IMonsterFormDropdown;
  monsterB?: IMonsterFormDropdown;
}

export const MonsterFusionDisplay: Component<IProps> = (props: IProps) => {
  const [monsterAFusionMap, setMonsterAFusionMap] =
    createSignal<Record<string, INodeResourceEnhanced>>();
  const [monsterBFusionMap, setMonsterBFusionMap] =
    createSignal<Record<string, INodeResourceEnhanced>>();
  const [maxImgHeight, setMaxImgHeight] = createSignal<number>(0);
  const [maxTopN, setMaxTopN] = createSignal<number>(0);
  const [sizeMultiplier, setSizeMultiplier] = createSignal<number>(1);

  createEffect(() => {
    if (props.fusionSpriteMap == null) return;
    if (props.itemMap == null) return;

    const fusionA = props.itemMap[props.monsterA?.id ?? ''];
    if (fusionA != null) {
      setMonsterAFusionMap(fusionA.nodes_enhanced);
    }

    const fusionB = props.itemMap[props.monsterB?.id ?? ''];
    if (fusionB != null) {
      setMonsterBFusionMap(fusionB.nodes_enhanced);
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

    let maxTop = 0;
    for (const node of Object.values(fusionA.nodes_enhanced)) {
      if (node.position.y < maxTop) {
        maxTop = node.position.y;
      }
    }
    const sizeH = screen.availHeight / 2.5 / maxH;
    const sizeW = screen.availWidth / 2.5 / maxW;
    const sizeM = Math.min(sizeH, sizeW);
    setMaxImgHeight(maxH);
    setSizeMultiplier(sizeM);
    setMaxTopN(Math.abs(maxTop) * sizeM);
  }, [props.monsterA?.id, props.monsterB?.id, props.fusionSpriteMap, props.itemMap]);

  const getNodesA = (
    a?: Record<string, INodeResourceEnhanced>,
    b?: Record<string, INodeResourceEnhanced>,
  ): Array<INodeResourceEnhanced> => {
    let nodes: Array<INodeResourceEnhanced> = [];
    for (const nodeA of Object.values(a ?? {})) {
      nodes.push(nodeA);
    }

    for (const nodeB of Object.values(b ?? {})) {
      // if (nodeB.inverse_match) {
      //   const nameIndex = nodes.findIndex((n) => n.name == nodeB.match_part);
      //   if (nameIndex > -1) {
      //     console.log(nodes[nameIndex].name);
      //     nodes.splice(nameIndex, 1);
      //   }
      //   const parentIndex = nodes.findIndex((n) => n.parent == nodeB.match_part);
      //   if (parentIndex > -1) {
      //     console.log(nodes[parentIndex].name);
      //     nodes.splice(parentIndex, 1);
      //   }
      // }
      // if ((b.parent?.length ?? 0) != 0) {
      //   const parentB = props.fusionBPartsList[b.parent];
      //   if (parentB != null && b.inverse_match) {
      //     return b;
      //   }
      // }
    }
    // for (const bKey of Object.keys(b ?? {})) {
    //   distinctList.add(bKey);
    // }
    return nodes;
  };

  return (
    <>
      <MonsterFusionDisplayHeading
        translate={props.translate}
        monsterA={props.monsterA}
        monsterB={props.monsterB}
      />
      <div class="fusion-container mb-1">
        <Show when={monsterAFusionMap() != null && monsterBFusionMap() != null}>
          <div
            class="fusion-item"
            style={{
              'margin-top': `${maxTopN()}px`,
              height: sizeMultiplier() * maxImgHeight() + 'px',
              width: sizeMultiplier() * maxImgHeight() + 'px',
            }}
          >
            {getNodesA(monsterAFusionMap(), monsterBFusionMap()).map((node) => (
              <MonsterFusionNodeItem
                fusion={node}
                fusionSpriteMap={props.fusionSpriteMap}
                fusionPartsList={monsterAFusionMap() ?? {}}
                sizeMultiplier={sizeMultiplier()}
              />
            ))}
          </div>
        </Show>
      </div>
    </>
  );
};
