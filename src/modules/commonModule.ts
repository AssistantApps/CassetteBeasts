import fs from 'fs';
import path from 'path';

import { breadcrumb } from 'constant/breadcrumb';
import { defaultLocale } from 'constant/localisation';
import { ModuleType } from 'constant/module';
import { paths } from 'constant/paths';
import { routes } from 'constant/route';
import { site } from 'constant/site';
import type { IBreadcrumb } from 'contracts/breadcrumb';
import type { ILocalisation } from 'contracts/localisation';
import type { IAlternateUrl, PageData } from 'contracts/pageData';
import { sortByStringProperty } from 'helpers/sortHelper';
import { anyObject, promiseFromResult } from 'helpers/typescriptHacks';
import { getConfig } from 'services/internal/configService';
import { AssistantAppsModule } from './assistantApps/assistantAppsModule';
import { LocalisationModule } from './localisation/localisationModule';

export class CommonModule<T, TE> {
  type: ModuleType;
  dependsOn: Array<ModuleType>;
  intermediateFile: string;
  isReady: boolean = false;

  _baseDetails: Array<T> = [];
  _itemDetailMap: Record<string, TE> = {};

  constructor(props: {
    type: ModuleType;
    dependsOn: Array<ModuleType>;
    intermediateFile: string; //
  }) {
    this.type = props.type;
    this.dependsOn = props.dependsOn;
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
    overwrite: boolean,
  ) => promiseFromResult(anyObject);
  copyWav = async (overwrite: boolean) => promiseFromResult(anyObject);
  get = (id: string): TE => this._itemDetailMap[id];
  getMap = (): Record<number, TE> => this._itemDetailMap;

  getBasicPageData = <TK>(props: {
    langCode: string;
    modules: Array<CommonModule<unknown, unknown>>;
    breadcrumbs: Array<IBreadcrumb>;
    documentTitleUiKey?: string;
    documentTitle?: string;
    description?: string;
    relativePath?: string;
    data: TK;
  }): PageData<TK> => {
    const localeModule = this.getModuleOfType<ILocalisation>(
      props.modules,
      ModuleType.Localisation,
      true,
    ) as LocalisationModule;
    const assistantAppsModule = this.getModuleOfType<ILocalisation>(
      props.modules,
      ModuleType.AssistantApps,
      true,
    ) as AssistantAppsModule;
    const language = localeModule.get(props.langCode).messages;
    const translationRecords = localeModule.getUITranslations(props.langCode);
    const aaTranslationRecords = assistantAppsModule.getUITranslations(props.langCode);

    const humansArray = Object.keys(site.humans).map(
      (h) => (site.humans as unknown as Record<string, string>)[h],
    );
    const version = getConfig().packageVersion();
    const analyticsCode = getConfig().getAnalyticsCode();

    const alternateUrls: Array<IAlternateUrl> = [];
    if (props.relativePath != null) {
      for (const lang of localeModule.getLanguageCodes()) {
        const langSpecificRelPath = props.relativePath.replace(props.langCode, lang);
        const indexOfDivider = lang.indexOf('_');
        const alternateUrlLang = indexOfDivider > 0 ? lang.substring(0, indexOfDivider) : lang;
        if (alternateUrls.filter((au) => au.lang == alternateUrlLang).length > 0) continue;

        alternateUrls.push({
          href: `${site.rootUrl}${langSpecificRelPath}`,
          lang: alternateUrlLang,
        });
      }
      alternateUrls.push({
        href: `${site.rootUrl}${props.relativePath.replace(props.langCode, defaultLocale)}`,
        lang: 'x-default',
      });
    }

    const combinedTranslationRecords = {
      ...translationRecords,
      ...aaTranslationRecords,
    };

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
      relativePath: props.relativePath,
      documentTitle: props.documentTitle,
      documentTitleUiKey: props.documentTitleUiKey,
      breadcrumbs: [breadcrumb.home(props.langCode), ...props.breadcrumbs],
      translate: combinedTranslationRecords,
      availableLanguages: localeModule
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

  writePages = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {};
}
