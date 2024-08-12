import { createEffect, createSignal, Match, Switch, type Component } from 'solid-js';

import type { IFusionEnhanced } from 'contracts/fusion';
import type { IMonsterFormDropdown } from 'contracts/monsterForm';
import { MonsterDropdown } from 'components/monster/MonsterDropdown';
import { MonsterFusionDisplay } from 'components/monster/MonsterFusionDisplay';
import type { ISpriteAnim } from 'contracts/spriteAnim';
import { NetworkState } from 'constants/networkState';
import { LoadingSpinner } from 'components/common/Loading';
import { timeout } from 'helpers/asyncHelper';
import { defaultLocale } from 'constants/localisation';

interface IProps {
  locale: string;
  translate: Record<string, string>;
}

export const FusionPanel: Component<IProps> = (props: IProps) => {
  const [monsterA, setMonsterA] = createSignal<IMonsterFormDropdown>();
  const [monsterB, setMonsterB] = createSignal<IMonsterFormDropdown>();

  const [itemMap, setItemMap] = createSignal<Record<string, IFusionEnhanced>>();
  const [fusionSpriteMap, setFusionSpriteMap] = createSignal<Record<string, ISpriteAnim>>();
  const [monsterDropdown, setMonsterDropdown] = createSignal<Array<IMonsterFormDropdown>>([]);

  const [networkState, setNetworkState] = createSignal<NetworkState>(NetworkState.loading);

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

  createEffect(() => {
    setNetworkState(NetworkState.loading);
    loadData();
  }, []);

  return (
    <>
      <article class="mb-1 warning">
        <div class="card ta-center">⚠️ This is a work in progress</div>
      </article>
      <article class="mb-1">
        <div class="fusion">
          <div class="grid">
            <MonsterDropdown
              networkState={networkState()}
              translate={props.translate}
              monsters={monsterDropdown()}
              selectedMonster={monsterA()}
              selectMonster={setMonsterA}
            />
            <MonsterDropdown
              networkState={networkState()}
              translate={props.translate}
              monsters={monsterDropdown()}
              selectedMonster={monsterB()}
              selectMonster={setMonsterB}
            />
          </div>
          <Switch
            fallback={
              <div class="fusion-container">
                <div
                  style={{
                    margin: '5vh auto',
                  }}
                >
                  <LoadingSpinner size="xl" />
                </div>
              </div>
            }
          >
            <Match when={networkState() === NetworkState.error}>
              <summary data-TODO="translate">❌ Something went wrong</summary>
            </Match>
            <Match when={networkState() === NetworkState.success}>
              <MonsterFusionDisplay
                translate={props.translate}
                itemMap={itemMap()!}
                fusionSpriteMap={fusionSpriteMap()!}
                monsterA={monsterA()}
                monsterB={monsterB()}
              />
            </Match>
          </Switch>
        </div>
      </article>
    </>
  );
};
