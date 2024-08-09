import fs from 'fs';
import path from 'path';

import { AppImage } from 'constants/image';
import { IntermediateFile } from 'constants/intermediateFile';
import { UIKeys } from 'constants/localisation';
import { ModuleType } from 'constants/module';
import { paths } from 'constants/paths';
import { routes } from 'constants/route';
import type { IElementEnhanced } from 'contracts/element';
import type { IHomePageCard } from 'contracts/homePageCard';
import type { IMonsterForm } from 'contracts/monsterForm';
import type { IStatusEffect } from 'contracts/statusEffect';
import type { IWorld } from 'contracts/world';
import { CommonModule } from 'modules/commonModule';

export class MiscModule extends CommonModule<unknown, unknown> {
  private _cards: Array<IHomePageCard> = [];

  constructor() {
    super({
      type: ModuleType.Misc,
      intermediateFile: IntermediateFile.misc,
      loadOnce: true,
      dependsOn: [
        ModuleType.Version,
        ModuleType.Localisation,
        ModuleType.MonsterForms,
        ModuleType.StatusEffect,
        ModuleType.Elements,
        ModuleType.World,
      ],
    });
  }

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const monsterModule = this.getModuleOfType<IMonsterForm>(modules, ModuleType.MonsterForms);
    const elementModule = this.getModuleOfType<IElementEnhanced>(modules, ModuleType.Elements);
    const statusEffectModule = this.getModuleOfType<IStatusEffect>(
      modules,
      ModuleType.StatusEffect,
    );
    const worldModule = this.getModuleOfType<IWorld>(modules, ModuleType.World);

    this._cards = [
      {
        uiKey: UIKeys.viewMonsters,
        url: routes.monsters,
        gameUrl: monsterModule.get('kittelly').tape_sticker_texture?.path,
      },
      {
        uiKey: UIKeys.viewStickers,
        url: routes.moves,
        imageUrl: AppImage.moves,
      },
      {
        uiKey: 'characters',
        url: routes.characters,
        imageUrl: AppImage.characters,
      },
      {
        uiKey: UIKeys.elementalTypeChart,
        url: routes.elementReactions,
        gameUrl: elementModule.get('astral').icon?.path,
      },
      {
        uiKey: UIKeys.statusEffect,
        url: routes.statusEffect,
        gameUrl: statusEffectModule.get('gambit').icon?.path,
      },
      {
        uiKey: UIKeys.map,
        url: routes.map,
        gameUrl: worldModule.get('overworld').map_texture?.path,
        hideInMobile: true,
      },
    ];

    this.isReady = true;
  };

  initFromIntermediate = async () => {};

  writeIntermediate = () => {
    const destFile = path.join(paths().intermediateFolder, this.intermediateFile);
    fs.writeFileSync(destFile, JSON.stringify(this._cards, null, 2), 'utf-8');
  };
}
