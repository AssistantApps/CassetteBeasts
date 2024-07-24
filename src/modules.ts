import { AssistantAppsModule } from 'modules/assistantApps/assistantAppsModule';
import { CharacterModule } from 'modules/character/characterModule';
import { CharacterSfxModule } from 'modules/characterSfx/characterSfxModule';
import { CharacterSpriteAnimModule } from 'modules/characterSpriteAnim/characterSpriteAnimModule';
import { CommonModule } from 'modules/commonModule';
import { ElementReactionModule } from 'modules/elementReactions/elementReactionModule';
import { ElementsModule } from 'modules/elements/elementsModule';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { MiscModule } from 'modules/misc/miscModule';
import { MonsterFormsModule } from 'modules/monsterForms/monsterFormsModule';
import { MonsterSpriteAnimModule } from 'modules/monsterSpriteAnim/monsterSpriteAnimModule';
import { MovesModule } from 'modules/moves/movesModule';
import { StatusEffectModule } from 'modules/statusEffect/statusEffectModule';
import { VersionModule } from 'modules/version/versionModule';
import { WorldModule } from 'modules/world/worldModule';

export const getModules = async (props: {
  loadFromJson?: boolean;
}): Promise<[LocalisationModule, Array<CommonModule<unknown>>]> => {
  const localisationModule = new LocalisationModule();
  if (props.loadFromJson == true) {
    await localisationModule.initFromIntermediate();
  } else {
    await localisationModule.init();
  }
  const modules: Array<CommonModule<unknown>> = [
    localisationModule,
    new MiscModule(),
    new WorldModule(),
    new VersionModule(),
    new AssistantAppsModule(),

    // Element
    new ElementsModule(),
    new ElementReactionModule(),
    new StatusEffectModule(),

    // Monster
    new MonsterFormsModule(),
    new MonsterSpriteAnimModule(),
    new MovesModule(),

    // Character
    new CharacterModule(),
    new CharacterSpriteAnimModule(),
    new CharacterSfxModule(),

    // Fusions
    // new FusionModule(),
    // new FusionSpriteAnimModule(),
  ];
  return [localisationModule, modules];
};
