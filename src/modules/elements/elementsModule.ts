import fs from 'fs';

import { IntermediateFile } from 'constants/intermediateFile';
import { ModuleType } from 'constants/module';
import type { IElement, IElementEnhanced } from 'contracts/element';
import type { ILocalisation } from 'contracts/localisation';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { copyImageFromRes, copyImageToGeneratedFolder } from 'helpers/imageHelper';
import { pad } from 'helpers/stringHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import type { LocalisationModule } from 'modules/localisation/localisationModule';
import { elementMapFromDetailList } from './elementMapFromDetailList';

export class ElementsModule extends CommonModule<IElement, IElementEnhanced> {
  private _folder = FolderPathHelper.elements();

  constructor() {
    super({
      type: ModuleType.Elements,
      intermediateFile: IntermediateFile.elements,
      dependsOn: [ModuleType.Localisation],
    });
  }

  init = async () => {
    if (this.isReady) return;
    const list = fs.readdirSync(this._folder);

    for (const file of list) {
      const detail = await readItemDetail({
        fileName: file,
        folder: this._folder,
        mapFromDetailList: elementMapFromDetailList,
      });
      this._baseDetails.push(detail);
    }

    return `${pad(this._baseDetails.length, 3, ' ')} elements`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(
      modules,
      ModuleType.Localisation,
    ) as LocalisationModule;

    for (const detail of this._baseDetails) {
      const detailEnhanced: IElementEnhanced = {
        ...detail,
        name_localised: localeModule.translate(langCode, detail.name),
      };

      this._itemDetailMap[detailEnhanced.id] = detailEnhanced;
    }

    this.isReady = true;
  };

  getImagesFromGameFiles = async (overwrite: boolean) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IElementEnhanced = this._itemDetailMap[mapKey];
      await copyImageFromRes(overwrite, detailEnhanced.icon);
    }
  };

  generateImages = async (overwrite: boolean) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IElementEnhanced = this._itemDetailMap[mapKey];
      await copyImageToGeneratedFolder(overwrite, detailEnhanced.icon);
    }
  };
}
