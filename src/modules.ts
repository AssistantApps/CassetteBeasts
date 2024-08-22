import { AssistantAppsModule } from 'modules/assistantApps/assistantAppsModule';
import { CharacterModule } from 'modules/character/characterModule';
import { CharacterSfxModule } from 'modules/characterSfx/characterSfxModule';
import { CharacterSpriteAnimModule } from 'modules/characterSpriteAnim/characterSpriteAnimModule';
import { CommonModule } from 'modules/commonModule';
import { ElementReactionModule } from 'modules/elementReactions/elementReactionModule';
import { ElementsModule } from 'modules/elements/elementsModule';
import { FusionModule } from 'modules/fusion/fusionModule';
import { FusionSpriteAnimModule } from 'modules/fusionSpriteAnim/fusionSpriteAnimModule';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { MiscModule } from 'modules/misc/miscModule';
import { MonsterFormsModule } from 'modules/monsterForms/monsterFormsModule';
import { MonsterSpawnModule } from 'modules/monsterSpawn/monsterSpawnModule';
import { MonsterSpriteAnimModule } from 'modules/monsterSpriteAnim/monsterSpriteAnimModule';
import { MovesModule } from 'modules/moves/movesModule';
import { StatusEffectModule } from 'modules/statusEffect/statusEffectModule';
import { VersionModule } from 'modules/version/versionModule';
import { WorldModule } from 'modules/world/worldModule';

export const getModules = async (props: {
  loadFromJson?: boolean;
}): Promise<[LocalisationModule, Array<CommonModule<unknown, unknown>>]> => {
  const localisationModule = new LocalisationModule();
  const versionModule = new VersionModule();
  if (props.loadFromJson == true) {
    await localisationModule.initFromIntermediate();
    await versionModule.initFromIntermediate();
  } else {
    const message = await localisationModule.init();
    console.log(`\t${message}`);
  }
  versionModule.updatePackageVersionNumber();

  const modules: Array<CommonModule<unknown, unknown>> = [
    localisationModule,
    versionModule,
    new MiscModule(),
    new WorldModule(),
    new AssistantAppsModule(),

    // Element
    new ElementsModule(),
    new ElementReactionModule(),
    new StatusEffectModule(),

    // Monster
    new MonsterFormsModule(),
    new MonsterSpriteAnimModule(),
    new MonsterSpawnModule(),

    // Moves
    new MovesModule(),

    // Character
    new CharacterModule(),
    new CharacterSpriteAnimModule(),
    new CharacterSfxModule(),

    // Fusions
    new FusionModule(),
    new FusionSpriteAnimModule(),
  ];
  return [localisationModule, modules];
};
