import { type Component } from 'solid-js';

import type { IFusionEnhanced } from 'contracts/fusion';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
import { MonsterDropdown } from 'components/monster/MonsterDropdown';

interface IProps {
  translate: Record<string, string>;
  itemMap: Record<string, IFusionEnhanced>;
  monsterDropdown: Array<IMonsterFormDropdown>;
}

export const FusionPanel: Component<IProps> = (props: IProps) => {
  return (
    <div class="fusion">
      <div class="grid">
        <MonsterDropdown translate={props.translate} monsters={props.monsterDropdown} />
        <MonsterDropdown translate={props.translate} monsters={props.monsterDropdown} />
      </div>
    </div>
  );
};
