import React, { useEffect, useState } from 'react';

import { LoadingSpinner } from 'components/common/Loading';
import { MonsterDropdown } from 'components/monster/MonsterDropdown';
import { MonsterFusionDisplay } from 'components/monster/MonsterFusionDisplay';
import { defaultLocale } from 'constants/localisation';
import { NetworkState } from 'constants/networkState';
import type { IFusionEnhanced } from 'contracts/fusion';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
import type { ISpriteAnim } from 'contracts/spriteAnim';

interface IProps {
  locale: string;
  translate: Record<string, string>;
}

export const FusionPanel: React.FC<IProps> = (props: IProps) => {
  const [monsterA, setMonsterA] = useState<IMonsterFormDropdown>();
  const [monsterB, setMonsterB] = useState<IMonsterFormDropdown>();

  const [itemMap, setItemMap] = useState<Record<string, IFusionEnhanced>>({});
  const [fusionSpriteMap, setFusionSpriteMap] = useState<Record<string, ISpriteAnim>>({});
  const [monsterDropdown, setMonsterDropdown] = useState<Array<IMonsterFormDropdown>>([]);

  const [networkState, setNetworkState] = useState<NetworkState>(NetworkState.loading);

  const loadData = async () => {
    const fusionTask = fetch(`/${defaultLocale}/data/fusion.json`);
    const fusionSpriteAnimTask = fetch(`/${defaultLocale}/data/fusionSpriteAnim.json`);
    const monsterDropDownTask = fetch(`/${props.locale}/data/monsterDropDown.json`);

    try {
      const [fusionResponse, fusionSpriteAnimResponse, monsterDropDownResponse] = await Promise.all(
        [fusionTask, fusionSpriteAnimTask, monsterDropDownTask],
      );

      const [fusion, fusionSpriteAnim, monsterDropDown] = await Promise.all([
        fusionResponse.json(),
        fusionSpriteAnimResponse.json(),
        monsterDropDownResponse.json(),
      ]);

      setItemMap(fusion);
      setFusionSpriteMap(fusionSpriteAnim);
      setMonsterDropdown(monsterDropDown);
    } catch (e) {
      console.log(e);
      setNetworkState(NetworkState.error);
    }

    setNetworkState(NetworkState.success);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <article className="mb-1 warning">
        <div className="card ta-center">⚠️ This is a work in progress</div>
      </article>
      <article className="mb-1">
        <div className="fusion">
          {(networkState === NetworkState.loading || networkState === NetworkState.pending) && (
            <div className="fusion-container">
              <div
                style={{
                  margin: '5vh auto',
                }}
              >
                <LoadingSpinner size="xl" />
              </div>
            </div>
          )}
          {networkState === NetworkState.error && (
            <summary data-TODO="translate">❌ Something went wrong</summary>
          )}
          {networkState === NetworkState.success && (
            <>
              <div className="grid">
                <MonsterDropdown
                  translate={props.translate}
                  monsters={monsterDropdown}
                  selectedMonster={monsterA}
                  selectMonster={setMonsterA}
                />
                <MonsterDropdown
                  translate={props.translate}
                  monsters={monsterDropdown}
                  selectedMonster={monsterB}
                  selectMonster={setMonsterB}
                />
              </div>
              <MonsterFusionDisplay
                translate={props.translate}
                itemMap={itemMap}
                fusionSpriteMap={fusionSpriteMap}
                monsterA={monsterA}
                monsterB={monsterB}
              />
            </>
          )}
        </div>
      </article>
    </>
  );
};
