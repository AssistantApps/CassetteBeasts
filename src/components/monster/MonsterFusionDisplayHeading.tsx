import { createEffect, createSignal, type Component } from 'solid-js';

import type { IMonsterFormDropdown } from 'contracts/monsterForm';

interface IProps {
  translate: Record<string, string>;
  monsterA?: IMonsterFormDropdown;
  monsterB?: IMonsterFormDropdown;
}

export const MonsterFusionDisplayHeading: Component<IProps> = (props: IProps) => {
  const [title, setTitle] = createSignal<string>('');

  createEffect(() => {
    if (props.monsterA == null && props.monsterB == null) {
      setTitle('...');
      return;
    }
    if (props.monsterA?.id == props.monsterB?.id) {
      const sameFusionNum = (props.monsterA?.bestiary_index ?? 0) % 10;
      const sameFusionTranslatedTemplate = props.translate[`SAME_FUSION_NAME_${sameFusionNum + 1}`];
      setTitle(sameFusionTranslatedTemplate.replace('{0}', props.monsterA?.name ?? ''));
      return;
    }
    setTitle(`${props.monsterA?.prefix ?? '...'}${props.monsterB?.suffix ?? '...'}`);
  }, [props.monsterA?.id, props.monsterB?.id]);

  return <h2 class="ta-center mt-1">{title()}</h2>;
};
