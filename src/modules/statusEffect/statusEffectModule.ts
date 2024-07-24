import fs from 'fs';

import { IntermediateFile } from 'constant/intermediateFile';
import { ModuleType } from 'constant/module';
import { ILocalisation } from 'contracts/localisation';
import { IStatusEffect, IStatusEffectEnhanced } from 'contracts/statusEffect';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import {
  copyImageFromRes,
  copyImageToGeneratedFolder,
  generateMetaImage,
} from 'helpers/imageHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { statusEffectMapFromDetailList } from './statusEffectMapFromDetailList';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { breadcrumb } from 'constant/breadcrumb';
import { routes } from 'constant/route';
import { getHandlebar } from 'services/internal/handlebarService';
import { sortByStringProperty } from 'helpers/sortHelper';
import { handlebarTemplate } from 'constant/handlebar';
import { IElement, IElementEnhanced } from 'contracts/element';
import path from 'path';
import { paths } from 'constant/paths';
import { scaffoldFolderAndDelFileIfOverwrite } from 'helpers/fileHelper';
import { getStatusMetaImage } from './statusEffectMeta';
import { site } from 'constant/site';

export class StatusEffectModule extends CommonModule<IStatusEffect> {
  private _folder = FolderPathHelper.statusEffects();

  constructor() {
    super({
      type: ModuleType.StatusEffect,
      intermediateFile: IntermediateFile.statusEffects,
      dependsOn: [ModuleType.Localisation, ModuleType.Elements],
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
    return `${this._baseDetails.length} status effects`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(modules, ModuleType.Localisation);
    const language = localeModule.get(langCode).messages;
    const elementModule = this.getModuleOfType<IElement>(modules, ModuleType.Elements);

    for (const detail of this._baseDetails) {
      let name_localised = language[detail.name];
      if (name_localised.includes('{type')) {
        const element = elementModule.get('air') as IElementEnhanced;
        name_localised.replace('{type', element.name_localised);
      }
      const detailEnhanced: IStatusEffectEnhanced = {
        ...detail,
        name_localised,
        description_localised: language[detail.description],
        toast_on_remove_localised: language[detail.toast_on_remove],
        name_modifier_localised: language[detail.name_modifier],
        meta_image_url: `/assets/img/meta/${langCode}${routes.statusEffect}/${encodeURI(
          detail.id,
        )}.png`,
      };

      this._itemDetailMap[detailEnhanced.id] = detailEnhanced;
    }
    this.isReady = true;
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
    overwrite: boolean,
  ) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IStatusEffectEnhanced = this._itemDetailMap[mapKey];

      const outputFullPath = path.join(paths().destinationFolder, detailEnhanced.meta_image_url);
      const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
      if (exists) continue;

      const extraData = await getStatusMetaImage(
        langCode,
        detailEnhanced.icon?.path,
        detailEnhanced.description_localised ?? '...',
      );
      const template = getHandlebar().getCompiledTemplate<unknown>(
        handlebarTemplate.statusEffectMeta,
        { ...site, data: detailEnhanced, ...extraData } as any,
      );

      generateMetaImage({ overwrite, template, langCode, outputFullPath });
    }
  };

  writePages = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const mainBreadcrumb = breadcrumb.statusEffect(langCode);
    const list: Array<IStatusEffectEnhanced> = [];
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const details: IStatusEffectEnhanced = this._itemDetailMap[mapKey];
      if (details.icon == null) continue;
      list.push(details);
      const relativePath = `${langCode}${routes.statusEffect}/${encodeURI(mapKey)}.html`;
      const detailPageData = this.getBasicPageData({
        langCode,
        modules,
        documentTitle: details.name_localised,
        breadcrumbs: [
          mainBreadcrumb,
          breadcrumb.statusEffectDetail(langCode, details.name_localised),
        ],
        data: details,
        relativePath,
      });
      detailPageData.images.twitter = details.meta_image_url;
      detailPageData.images.facebook = details.meta_image_url;
      await getHandlebar().compileTemplateToFile({
        data: detailPageData,
        outputFiles: [relativePath],
        templateFile: handlebarTemplate.statusEffectDetail,
      });
    }
    const relativePath = `${langCode}${routes.statusEffect}/index.html`;
    const sortedList = list.sort(sortByStringProperty((l) => l.name_localised));
    await getHandlebar().compileTemplateToFile({
      data: this.getBasicPageData({
        langCode,
        modules,
        documentTitleUiKey: mainBreadcrumb.uiKey,
        breadcrumbs: [mainBreadcrumb],
        data: { list: sortedList },
        relativePath,
      }),
      outputFiles: [relativePath],
      templateFile: handlebarTemplate.statusEffect,
    });
  };
}
