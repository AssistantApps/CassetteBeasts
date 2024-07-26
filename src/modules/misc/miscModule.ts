import { handlebarTemplate } from 'constant/handlebar';
import { AppImage } from 'constant/image';
import { IntermediateFile } from 'constant/intermediateFile';
import { UIKeys, defaultLocale } from 'constant/localisation';
import { ModuleType } from 'constant/module';
import { routes } from 'constant/route';
import { IElementEnhanced } from 'contracts/element';
import { IHomePageCard } from 'contracts/homePageCard';
import { ILocalisation } from 'contracts/localisation';
import { IMonsterForm } from 'contracts/monsterForm';
import { IStatusEffect } from 'contracts/statusEffect';
import { CommonModule } from 'modules/commonModule';
import { getHandlebar } from 'services/internal/handlebarService';

export class MiscModule extends CommonModule<ILocalisation> {
  private _cards: Array<IHomePageCard> = [];

  constructor() {
    super({
      type: ModuleType.Misc,
      intermediateFile: IntermediateFile.misc,
      dependsOn: [
        ModuleType.Version,
        ModuleType.Localisation,
        ModuleType.MonsterForms,
        ModuleType.StatusEffect,
        ModuleType.Elements,
      ],
    });
  }

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const monsterModule = this.getModuleOfType<IMonsterForm>(modules, ModuleType.MonsterForms);
    const elementModule = this.getModuleOfType<IElementEnhanced>(modules, ModuleType.Elements);
    const statusEffectModule = this.getModuleOfType<IStatusEffect>(
      modules,
      ModuleType.StatusEffect,
    );

    this._cards = [
      {
        uiKey: UIKeys.viewMonsters,
        url: routes.monsters,
        gameUrl: monsterModule.get('kittelly').tape_sticker_texture.path,
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
        gameUrl: elementModule.get('astral').icon.path,
      },
      {
        uiKey: UIKeys.statusEffect,
        url: routes.statusEffect,
        gameUrl: statusEffectModule.get('gambit').icon.path,
      },
    ];

    this.isReady = true;
  };

  initFromIntermediate = async () => {}; // no intermediate file
  writeIntermediate = () => {}; // no intermediate file

  writePages = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    await Promise.all([
      this.writeMiscPage(langCode, routes.home, handlebarTemplate.home, modules),
      this.writeMiscPage(langCode, routes.about, handlebarTemplate.about, modules),
    ]);

    if (langCode != defaultLocale) return;
    const miscFiles: Array<{ src: string; dest?: string }> = [
      { src: handlebarTemplate.cname, dest: 'CNAME' },
      { src: handlebarTemplate.colour, dest: '../src/scss/_colour.scss' },
      { src: handlebarTemplate.termsAndConditions },
      { src: handlebarTemplate.privacyPolicy },
      { src: handlebarTemplate.openSearch },
      { src: handlebarTemplate.humans },
      { src: handlebarTemplate.robots },
    ];

    for (const miscFile of miscFiles) {
      await getHandlebar().compileTemplateToFile({
        data: this.getBasicPageData({
          langCode,
          modules,
          breadcrumbs: [],
          data: {},
        }),
        outputFiles: [miscFile.dest ?? miscFile.src.replace('misc/', '').replace('.hbs', '')],
        templateFile: miscFile.src,
      });
    }
  };

  private writeMiscPage = async (
    langCode: string,
    outputFile: string,
    handleBarTemplate: string,
    modules: Array<CommonModule<unknown>>,
  ) => {
    const outputFiles = [`${langCode}${outputFile}`];
    if (langCode == defaultLocale) {
      outputFiles.push(outputFile);
    }

    await getHandlebar().compileTemplateToFile({
      data: this.getBasicPageData({
        langCode,
        modules,
        breadcrumbs: [],
        data: { cards: this._cards },
      }),
      outputFiles,
      templateFile: handleBarTemplate,
    });
  };
}
