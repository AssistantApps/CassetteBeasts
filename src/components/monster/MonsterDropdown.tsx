import { type Component } from 'solid-js';

import type { IFusionEnhanced } from 'contracts/fusion';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
import { UIKeys } from 'constants/localisation';
import { imgUrl } from 'helpers/urlHelper';

interface IProps {
  translate: Record<string, string>;
  monsters: Array<IMonsterFormDropdown>;
}

export const MonsterDropdown: Component<IProps> = (props: IProps) => {
  return (
    <details class="monster dropdown">
      <summary>{props.translate[UIKeys.viewMonsters]}</summary>
      <ul>
        {props.monsters.map((monster) => (
          <li>
            <img src={imgUrl(monster.icon)} alt={monster.name} />
            <p>{monster.name}</p>
          </li>
        ))}
      </ul>
    </details>
  );
};
