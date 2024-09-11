import fs from 'fs';
import path from 'path';

import { handlebarTemplate } from 'constants/handlebar';
import { IntermediateFile } from 'constants/intermediateFile';
import { UIKeys } from 'constants/localisation';
import { ModuleType } from 'constants/module';
import { paths } from 'constants/paths';
import { routes } from 'constants/route';
import { site } from 'constants/site';
import type { IElement, IElementEnhanced } from 'contracts/element';
import type { ILocalisation } from 'contracts/localisation';
import { moveToSimplified } from 'contracts/mapper/moveMapper';
import type { IMove, IMoveEnhanced, IMoveSimplified } from 'contracts/move';
import type { IStatusEffect, IStatusEffectEnhanced } from 'contracts/statusEffect';
import { scaffoldFolderAndDelFileIfOverwrite } from 'helpers/fileHelper';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import {
  copyImageFromRes,
  copyImageToGeneratedFolder,
  generateMetaImage,
} from 'helpers/imageHelper';
import { randomNumbers } from 'helpers/mathHelper';
import { pad } from 'helpers/stringHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { MovesModule } from 'modules/moves/movesModule';
import { getHandlebar } from 'services/internal/handlebarService';
import { statusEffectMapFromDetailList } from './statusEffectMapFromDetailList';
import { getStatusListMetaImage, getStatusMetaImage } from './statusEffectMeta';

export class StatusEffectModule extends CommonModule<IStatusEffect, IStatusEffectEnhanced> {
  private _folder = FolderPathHelper.statusEffects();

  constructor() {
    super({
      type: ModuleType.StatusEffect,
      intermediateFile: IntermediateFile.statusEffects,
      dependsOn: [
        ModuleType.Localisation, //
        ModuleType.Elements,
      ],
    });
  }

  init = async () => {
    if (this.isReady) return;
    const list = fs.readdirSync(this._folder);

    for (const file of list) {
      const detail = await readItemDetail({
        fileName: file,
        folder: this._folder,
        mapFromDetailList: statusEffectMapFromDetailList(file.replace('.tres', '')),
      });
      this._baseDetails.push(detail);
    }
    return `${pad(this._baseDetails.length, 3, ' ')} status effects`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(
      modules,
      ModuleType.Localisation,
    ) as LocalisationModule;
    const elementModule = this.getModuleOfType<IElement>(modules, ModuleType.Elements);

    for (const detail of this._baseDetails) {
      let name_localised = localeModule.translate(langCode, detail.name);
      if (name_localised.includes('{type}')) {
        const element = elementModule.get('air') as IElementEnhanced;
        name_localised = name_localised.replace('{type}', element.name_localised);
      }
      const detailEnhanced: IStatusEffectEnhanced = {
        ...detail,
        name_localised,
        description_localised: (localeModule.translate(langCode, detail.description) ?? '')
          .replaceAll("\\'", "'")
          .replaceAll('\\"', "'"),
        toast_on_remove_localised: localeModule.translate(langCode, detail.toast_on_remove),
        name_modifier_localised: localeModule.translate(langCode, detail.name_modifier),
        meta_image_url: `/assets/img/meta/${langCode}${routes.statusEffect}/${encodeURI(
          detail.id,
        )}.png`,

        // initialise the following later
        moves_that_cause_this_effect: [],
      };

      this._itemDetailMap[detailEnhanced.id] = detailEnhanced;
    }
    this.isReady = true;
  };

  combineData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const moveModule = this.getModuleOfType<IMove>(modules, ModuleType.Moves, true) as MovesModule;
    const statusEffectToMovesIdMap = moveModule.getStatusEffectToMovesIdMap();

    for (const statusKey of Object.keys(this._itemDetailMap)) {
      const moveIds = statusEffectToMovesIdMap[statusKey] ?? [];

      const moves_that_cause_this_effect: Array<IMoveSimplified> = [];
      for (const moveId of moveIds) {
        const moveEnhanced = moveModule.get(moveId) as IMoveEnhanced;
        moves_that_cause_this_effect.push(moveToSimplified(moveEnhanced));
      }
      this._itemDetailMap[statusKey].moves_that_cause_this_effect = moves_that_cause_this_effect;
    }
  };

  getImagesFromGameFiles = async (overwrite: boolean) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IStatusEffectEnhanced = this._itemDetailMap[mapKey];
      await copyImageFromRes(overwrite, detailEnhanced.icon);
    }
  };

  generateImages = async (overwrite: boolean) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IStatusEffectEnhanced = this._itemDetailMap[mapKey];
      await copyImageToGeneratedFolder(overwrite, detailEnhanced.icon);
    }
  };

  generateMetaImages = async (
    langCode: string,
    localeModule: LocalisationModule,
    modules: Array<CommonModule<unknown, unknown>>,
    overwrite: boolean,
  ) => {
    await this._getStatusEffectListMetaImage(langCode, overwrite, localeModule);

    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IStatusEffectEnhanced = this._itemDetailMap[mapKey];

      const outputFullPath = path.join(paths().destinationFolder, detailEnhanced.meta_image_url);
      const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
      if (exists) continue;

      const extraData = await getStatusMetaImage(
        langCode,
        detailEnhanced.icon?.path ?? '',
        detailEnhanced.description_localised ?? '...',
      );
      const template = getHandlebar().getCompiledTemplate<unknown>(
        handlebarTemplate.statusEffectMeta,
        { ...site, data: detailEnhanced, ...extraData } as any,
      );

      generateMetaImage({ overwrite, template, langCode, outputFullPath });
    }
  };

  private _getStatusEffectListMetaImage = async (
    langCode: string,
    overwrite: boolean,
    localeModule: LocalisationModule,
  ) => {
    const outputFile = `/assets/img/meta/${langCode}${routes.statusEffect}-meta.png`;
    const outputFullPath = path.join(paths().destinationFolder, outputFile);
    const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
    if (exists) return;

    const allKeys = Object.keys(this._itemDetailMap);
    const [first, second, third] = randomNumbers(3, 0, allKeys.length - 1);
    const list = [
      this._itemDetailMap[allKeys[first]],
      this._itemDetailMap[allKeys[second]],
      this._itemDetailMap[allKeys[third]],
    ];

    const extraData = await getStatusListMetaImage(
      list.map((m) => m.name_localised),
      list.map((m) => m.icon?.path),
    );
    const title = localeModule.translate(langCode, UIKeys.statusEffect);
    const template = getHandlebar().getCompiledTemplate<unknown>(
      handlebarTemplate.statusEffectListMetaImage,
      { ...extraData, title },
    );

    generateMetaImage({ overwrite, template, langCode, outputFullPath });
  };
}
