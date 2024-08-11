import type { Component, JSX } from 'solid-js';

import type { IFusionEnhanced } from 'contracts/fusion';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
import { UIKeys } from 'constants/localisation';
import { imgUrl } from 'helpers/urlHelper';

interface IProps {
  translate: Record<string, string>;
  selectedMonster?: IMonsterFormDropdown;
  selectMonster: (mon: IMonsterFormDropdown) => void;
  monsters: Array<IMonsterFormDropdown>;
}

export const MonsterDropdown: Component<IProps> = (props: IProps) => {
  let detailRef: HTMLDetailsElement | undefined;
  const renderMonster = (monster: IMonsterFormDropdown): JSX.Element => (
    <>
      <img src={imgUrl(monster.icon)} alt={monster.name} />
      <p>{monster.name}</p>
    </>
  );

  const onMonsterClick = (monster: IMonsterFormDropdown) => {
    if (detailRef != null) {
      detailRef.removeAttribute('open');
    }

    props.selectMonster(monster);
  };

  return (
    <details ref={detailRef} class="monster dropdown">
      <summary>
        {props.selectedMonster != null ? (
          <div class="monster-option selected">{renderMonster(props.selectedMonster)}</div>
        ) : (
          props.translate[UIKeys.viewMonsters]
        )}
      </summary>
      <ul>
        {props.monsters.map((monster) => (
          <li class="monster-option noselect" onClick={() => onMonsterClick(monster)}>
            {renderMonster(monster)}
          </li>
        ))}
      </ul>
    </details>
  );
};
