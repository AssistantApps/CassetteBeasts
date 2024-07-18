import fs from 'fs';
import path from 'path';

import { ModuleType } from 'constant/module';
import { paths } from 'constant/paths';
import { LocalisationModule } from './localisation/localisationModule';
import { PageData } from 'contracts/pageData';
import { site } from 'constant/site';
import { routes } from 'constant/route';
import { IBreadcrumb } from 'contracts/breadcrumb';
import { breadcrumb } from 'constant/breadcrumb';
import { sortByStringProperty } from 'helpers/sortHelper';
import { getConfig } from 'services/internal/configService';
import { anyObject, promiseFromResult } from 'helpers/typescriptHacks';
import { defaultLocale } from 'constant/localisation';

export class CommonModule<T> {
  type: ModuleType;
  dependsOn: Array<ModuleType>;
  intermediateFile: string;
  isReady: boolean = false;

  _baseDetails: Array<T> = [];
  _itemDetailMap: Record<number, T> = {};

  constructor(props: {
    type: ModuleType;
    dependsOn: Array<ModuleType>;
    intermediateFile: string; //
  }) {
    this.type = props.type;
    this.dependsOn = props.dependsOn;
    this.intermediateFile = props.intermediateFile;
  }

  getModuleOfType = <T>(
    modules: Array<CommonModule<unknown>>,
    typeToGet: ModuleType,
    ignoreWarning: boolean = false,
  ): CommonModule<T> => {
    if (!ignoreWarning && !this.dependsOn.includes(typeToGet)) {
      console.error(
        `Dependency '${ModuleType[typeToGet]}' is not in dependsOn array of module '${
          ModuleType[this.type]
        }'`,
      );
    }
    for (const module of modules) {
      if (module.type === typeToGet) return module as CommonModule<T>;
    }
  };

  init = async (): Promise<string | void> => undefined;
  enrichData = (langCode: string, modules: Array<CommonModule<unknown>>) => {};
  combineData = (langCode: string, modules: Array<CommonModule<unknown>>) => {};
  getImagesFromGameFiles = async (overwrite: boolean) => promiseFromResult(anyObject);
  generateImages = async (overwrite: boolean, modules: Array<CommonModule<unknown>>) =>
    promiseFromResult(anyObject);
  generateMetaImages = async (
    langCode: string,
    localeModule: LocalisationModule,
    overwrite: boolean,
  ) => promiseFromResult(anyObject);
  copyWav = async (overwrite: boolean) => promiseFromResult(anyObject);
  get = (id: string): T => this._itemDetailMap[id];
  getMap = (): Record<number, T> => this._itemDetailMap;

  getBasicPageData = <TK>(props: {
    langCode: string;
    localeModule: LocalisationModule;
    breadcrumbs: Array<IBreadcrumb>;
    documentTitleUiKey?: string;
    documentTitle?: string;
    description?: string;
    relativePath?: string;
    data: TK;
  }): PageData<TK> => {
    const language = props.localeModule.get(props.langCode).messages;

    const humansArray = Object.keys(site.humans).map((h) => site.humans[h]);
    const version = getConfig().packageVersion();
    const analyticsCode = getConfig().getAnalyticsCode();

    const alternateUrls = [];
    if (props.relativePath != null) {
      for (const lang of props.localeModule.getLanguageCodes()) {
        const langSpecificRelPath = props.relativePath.replace(props.langCode, lang);
        const indexOfDivider = lang.indexOf('_');
        alternateUrls.push({
          href: `${site.rootUrl}${langSpecificRelPath}`,
          lang: indexOfDivider > 0 ? lang.substring(0, indexOfDivider) : lang,
        });
      }
      alternateUrls.push({
        href: `${site.rootUrl}${props.relativePath.replace(props.langCode, defaultLocale)}`,
        lang: 'x-default',
      });
    }

    return {
      ...site,
      meta: {
        ...site.meta,
        description: props.description ?? site.meta.description,
      },
      humansArray,
      analyticsCode,
      version,
      routes,
      alternateUrls,
      data: props.data,
      langCode: props.langCode,
      documentTitle: props.documentTitle,
      documentTitleUiKey: props.documentTitleUiKey,
      breadcrumbs: [breadcrumb.home(props.langCode), ...props.breadcrumbs],
      translate: props.localeModule.getUITranslations(props.langCode),
      availableLanguages: props.localeModule
        .getLanguageCodes()
        .map((lang) => ({
          id: lang,
          name: language[`LANG_${lang}`],
        }))
        .sort(sortByStringProperty((l) => l.name)),
    };
  };

  initFromIntermediate = async () => {
    const srcFile = path.join(paths().intermediateFolder, this.intermediateFile);
    const jsonString = fs.readFileSync(srcFile, 'utf-8');
    this._itemDetailMap = JSON.parse(jsonString);

    const srcBaseFile = srcFile.replace(paths().intermediateFolder, paths().intermediateBaseFolder);
    const jsonBaseString = fs.readFileSync(srcBaseFile, 'utf-8');
    this._baseDetails = JSON.parse(jsonBaseString);
  };

  writeIntermediate = () => {
    const destFile = path.join(paths().intermediateFolder, this.intermediateFile);
    fs.writeFileSync(destFile, JSON.stringify(this._itemDetailMap, null, 2), 'utf-8');

    const destBaseFile = destFile.replace(
      paths().intermediateFolder,
      paths().intermediateBaseFolder,
    );
    fs.writeFileSync(destBaseFile, JSON.stringify(this._baseDetails, null, 2), 'utf-8');
  };

  writePages = async (langCode: string, modules: Array<CommonModule<unknown>>) => {};
}
