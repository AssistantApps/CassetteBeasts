import { AssistantAppsApiService } from '@assistantapps/assistantapps.api.client';

import { IntermediateFile } from 'constants/intermediateFile';
import { defaultLocale } from 'constants/localisation';
import { ModuleType } from 'constants/module';
import { site } from 'constants/site';
import type { ILocalisation } from 'contracts/localisation';
import { CommonModule } from 'modules/commonModule';

export class AssistantAppsModule extends CommonModule<unknown, ILocalisation> {
  constructor() {
    super({
      type: ModuleType.AssistantApps,
      intermediateFile: IntermediateFile.assistantAppsLanguage,
      loadOnce: true,
      dependsOn: [],
    });
  }

  init = async () => {
    if (this.isReady) return;

    const languageMap: Record<string, Array<string>> = {
      '023b02be-f341-40a5-aa91-0093f659894c': ['de_DE'],
      '11c7504c-2d93-4ade-9c43-1d5bcf25c87c': ['en'],
      '2b52205a-193c-4b4b-b0f5-09d71fdf2c56': ['es_ES', 'es_MX'],
      '7af87377-f4ba-46e9-b54e-d87c674e2fa4': ['fr_FR'],
      'e14f0857-b4c0-4d4e-bcdb-ca53c53b0890': ['it_IT'],
      '48197fcd-c07b-4858-870b-706935afe65e': ['ja_JP'],
      '89ead3b5-b8ab-4fee-b8da-82f558586ac5': ['ko_KR'],
      'f0253a91-a68e-409c-ad9f-41edb732695e': ['pt_BR'],
      '6ae2ddb0-6110-4ce3-a1fc-a68892cec761': ['zh_CN'],
    };

    const api = new AssistantAppsApiService();
    for (const langGuid of Object.keys(languageMap)) {
      const url = `TranslationExport/${site.assistantApps.appGuid}/${langGuid}`;
      const langExport = await api.get<Record<string, string>>(url);
      if (!langExport.isSuccess) continue;

      const appLangs = languageMap[langGuid];
      for (let index = 0; index < appLangs.length; index++) {
        const appLang = appLangs[index];
        const localisationObj: ILocalisation = {
          id: index,
          locale: appLang,
          messages: langExport.value,
        };
        this._itemDetailMap[appLang] = localisationObj;
      }
    }
    this.isReady = true;
  };

  getUITranslations = (locale: string): Record<string, string> => {
    let localLocal = locale;
    if (this._itemDetailMap[locale] == null) {
      console.error(`Locale '${locale}' does not exist`);
      localLocal = defaultLocale;
    }
    return this._itemDetailMap[localLocal].messages;
  };

  initFromIntermediate = () => this.init();
  writeIntermediate = () => {};
}
