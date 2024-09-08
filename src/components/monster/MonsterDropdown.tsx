import { type Component, type JSX } from 'solid-js';

import { UIKeys } from 'constants/localisation';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
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
      <img src={imgUrl(monster.icon)} alt={monster.name} loading="lazy" />
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
