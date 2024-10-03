import React, { createRef, useEffect, useState } from 'react';

import { UIKeys } from 'constants/localisation';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
import { imgUrl } from 'helpers/urlHelper';

interface IProps {
  translate: Record<string, string>;
  selectedMonster?: IMonsterFormDropdown;
  selectMonster: (mon: IMonsterFormDropdown) => void;
  monsters: Array<IMonsterFormDropdown>;
}

export const MonsterDropdown: React.FC<IProps> = (props: IProps) => {
  let inputRef = createRef<HTMLInputElement>();
  const [search, setSearch] = useState<string>('');
  const [isFocused, setFocused] = useState<boolean>(false);
  const [filteredMonsters, setFilteredMonsters] = useState<Array<IMonsterFormDropdown>>([]);

  useEffect(() => {
    setFilteredMonsters(props.monsters);
  }, [])

  const openDropDown = () => {
    if (isFocused) return;

    setFocused(true);
    const inputCurrent = inputRef.current;
    setTimeout(() => {
      inputCurrent!.focus();
    }, 250)
  }

  const renderMonster = (monster: IMonsterFormDropdown): JSX.Element => (
    <>
      <img src={imgUrl(monster.icon)} alt={monster.name} loading="lazy" />
      <p>{monster.name}</p>
    </>
  );

  const onSearchText = (inputText: any) => {
    const text = (inputText.target?.value ?? '');
    const monsters = props.monsters.filter(mon => mon.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()));
    setFilteredMonsters(monsters);
    setSearch(text);
  };

  const onMonsterClick = (monster: IMonsterFormDropdown) => {
    props.selectMonster(monster);
    setFocused(false);
    setSearch('');
    setFilteredMonsters(props.monsters);
  };

  return (
    <div className={"monster dropdown" + (isFocused ? ' open' : '')}>
      <div className="dropdown-backdrop noselect" onClick={() => setFocused(false)}></div>
      {(props.selectedMonster != null && isFocused == false) && (
        <div className="fake-input noselect">
          <div className="monster-option selected" onClick={openDropDown}>
            {renderMonster(props.selectedMonster)}
          </div>
        </div>
      )}
      <input
        type="text"
        ref={inputRef}
        className={"dropdown-input " + ((props.selectedMonster != null && isFocused == false) ? 'hidden' : '')}
        placeholder={props.translate[UIKeys.viewMonsters]}
        value={search}
        onFocus={openDropDown}
        onInput={onSearchText}
      ></input>
      <ul className="noselect">
        {
          (filteredMonsters.length > 0) ? (
            <>
              {filteredMonsters.map((monster) => (
                <li
                  key={monster.id}
                  className="monster-option noselect"
                  onClick={() => onMonsterClick(monster)}
                >
                  {renderMonster(monster)}
                </li>
              ))}
            </>
          ) : (
            <li className="monster-option disabled noselect">
              {props.translate['noItems']}...
            </li>)
        }
      </ul>
    </div>
  );
};
