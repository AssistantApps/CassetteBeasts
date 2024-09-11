import fs from 'fs';
import path from 'path';

import { defaultLocale } from 'constants/localisation';
import { ModuleType } from 'constants/module';
import { paths } from 'constants/paths';
import { createFoldersOfDestFilePath } from 'helpers/fileHelper';
import { anyObject, promiseFromResult } from 'helpers/typescriptHacks';
import { LocalisationModule } from './localisation/localisationModule';

export class CommonModule<T, TE> {
  type: ModuleType;
  dependsOn: Array<ModuleType>;
  intermediateFile: string;
  isReady: boolean = false;
  loadOnce: boolean = false;

  _baseDetails: Array<T> = [];
  _itemDetailMap: Record<string, TE> = {};

  constructor(props: {
    type: ModuleType;
    dependsOn: Array<ModuleType>;
    loadOnce?: boolean;
    intermediateFile: string; //
  }) {
    this.type = props.type;
    this.dependsOn = props.dependsOn;
    this.loadOnce = props.loadOnce ?? false;
    this.intermediateFile = props.intermediateFile;
  }

  getModuleOfType = <TE>(
    modules: Array<CommonModule<unknown, unknown>>,
    typeToGet: ModuleType,
    ignoreWarning: boolean = false,
  ): CommonModule<TE, TE> => {
    if (!ignoreWarning && !this.dependsOn.includes(typeToGet)) {
      console.error(
        `Dependency '${ModuleType[typeToGet]}' is not in dependsOn array of module '${
          ModuleType[this.type]
        }'`,
      );
    }
    for (const module of modules) {
      if (module.type === typeToGet) return module as CommonModule<TE, TE>;
    }

    throw `Module "${ModuleType[typeToGet]}" not found!`;
  };

  init = async (): Promise<string | void> => undefined;
  enrichData = (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {};
  combineData = (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {};
  getImagesFromGameFiles = async (overwrite: boolean) => promiseFromResult(anyObject);
  generateImages = async (overwrite: boolean, modules: Array<CommonModule<unknown, unknown>>) =>
    promiseFromResult(anyObject);
  generateMetaImages = async (
    langCode: string,
    localeModule: LocalisationModule,
    modules: Array<CommonModule<unknown, unknown>>,
    overwrite: boolean,
  ) => promiseFromResult(anyObject);
  copyWav = async (overwrite: boolean) => promiseFromResult(anyObject);
  get = (id: string): TE => this._itemDetailMap[id];
  getMap = (): Record<number, TE> => this._itemDetailMap;

  initFromIntermediate = async () => {
    const srcFile = path.join(paths().intermediateFolder, defaultLocale, this.intermediateFile);
    const jsonString = fs.readFileSync(srcFile, 'utf-8');
    this._itemDetailMap = JSON.parse(jsonString);

    const srcBaseFile = path.join(paths().intermediateFolder, this.intermediateFile);
    const jsonBaseString = fs.readFileSync(srcBaseFile, 'utf-8');
    this._baseDetails = JSON.parse(jsonBaseString);
  };

  writeIntermediate = (langCode: string) => {
    const destFile = path.join(paths().intermediateFolder, langCode, this.intermediateFile);
    createFoldersOfDestFilePath(destFile);
    fs.writeFileSync(destFile, JSON.stringify(this._itemDetailMap, null, 2), 'utf-8');

    this.writeAdditionalIntermediate(langCode);

    if (langCode != defaultLocale) return;
    const destBaseFile = path.join(paths().intermediateFolder, this.intermediateFile);
    createFoldersOfDestFilePath(destBaseFile);
    fs.writeFileSync(destBaseFile, JSON.stringify(this._baseDetails, null, 2), 'utf-8');
  };

  writeAdditionalIntermediate = (langCode: string) => {};
}
