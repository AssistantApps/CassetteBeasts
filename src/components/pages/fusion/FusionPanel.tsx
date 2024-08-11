import { createSignal, type Component } from 'solid-js';

import type { IFusionEnhanced } from 'contracts/fusion';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
import { MonsterDropdown } from 'components/monster/MonsterDropdown';
import { MonsterFusionDisplay } from 'components/monster/MonsterFusionDisplay';
import type { ISpriteAnim } from 'contracts/spriteAnim';

interface IProps {
  translate: Record<string, string>;
  itemMap: Record<string, IFusionEnhanced>;
  fusionSpriteMap: Record<string, ISpriteAnim>;
  monsterDropdown: Array<IMonsterFormDropdown>;
}

export const FusionPanel: Component<IProps> = (props: IProps) => {
  const [monsterA, setMonsterA] = createSignal<IMonsterFormDropdown>();
  const [monsterB, setMonsterB] = createSignal<IMonsterFormDropdown>();
  return (
    <div class="fusion">
      <div class="grid">
        <MonsterDropdown
          translate={props.translate}
          monsters={props.monsterDropdown}
          selectedMonster={monsterA()}
          selectMonster={setMonsterA}
        />
        <MonsterDropdown
          translate={props.translate}
          monsters={props.monsterDropdown}
          selectedMonster={monsterB()}
          selectMonster={setMonsterB}
        />
      </div>
      <MonsterFusionDisplay
        translate={props.translate}
        itemMap={props.itemMap}
        fusionSpriteMap={props.fusionSpriteMap}
        monsterA={monsterA()}
        monsterB={monsterB()}
      />
    </div>
  );
};
