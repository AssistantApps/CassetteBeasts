import fs from 'fs';
import path from 'path';
import readline from 'readline';

import { IntermediateFile } from 'constant/intermediateFile';
import {
  UIKeys,
  UIKeysRemoveNewline,
  UIKeysRemovePercent,
  UIKeysRemovePeriod,
  UIKeysRemoveTrailingColon,
  UIKeysReplace0Param,
  defaultLocale,
} from 'constant/localisation';
import { ModuleType } from 'constant/module';
import { paths } from 'constant/paths';
import { tresSeparator } from 'constant/tresSeparator';
import { ILocalisation } from 'contracts/localisation';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { stringStartsWith } from 'helpers/stringHelper';
import { CommonModule } from 'modules/commonModule';

const excludeLangCodes = ['eo'];

export class LocalisationModule extends CommonModule<ILocalisation> {
  constructor() {
    super({
      type: ModuleType.Localisation,
      intermediateFile: IntermediateFile.language,
      dependsOn: [],
    });
  }

  init = async () => {
    if (this.isReady) return;
    const filesToLoad = [
      '1.1_demo.txt',
      '1.1_release.txt',
      'dialogue_demo.txt',
      'dialogue_release.txt',
      'dlc_demo.txt',
      'dlc_release.txt',
      'online_release.txt',
      'strings_demo.txt',
      'strings_release.txt',
    ];

    for (const fileToLoad of filesToLoad) {
      const translationFolder = FolderPathHelper.translations();
      const allStringsPath = path.join(translationFolder, fileToLoad);

      const fileStream = fs.createReadStream(allStringsPath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      const defaultItem: ILocalisation = {
        id: 0,
        locale: defaultLocale,
        messages: {},
      };
      let item: ILocalisation = { ...defaultItem };
      let mode: 'none' | 'head' | 'messages' | 'locale';
      for await (const line of rl) {
        if (mode == 'none') {
          item = { ...defaultItem };
          mode = 'head';
        }

        if (mode == 'locale') {
          const indexOfLastQuote = line.lastIndexOf('"');
          const indexOfFirstQuote = line.indexOf('"') + 1;

          if (indexOfLastQuote > 0 && indexOfFirstQuote > 0) {
            const localeString = line.substring(indexOfFirstQuote, indexOfLastQuote);
            item.locale = localeString;
          }
          if (this._itemDetailMap[item.locale] != null) {
            this._itemDetailMap[item.locale].messages = {
              ...this._itemDetailMap[item.locale].messages,
              ...item.messages,
            };
          } else {
            this._itemDetailMap[item.locale] = { ...item };
          }
          mode = 'none';
          continue;
        }

        if (mode == 'messages') {
          const indexOfFirstBracket = line.indexOf('(') + 3;
          const indexOfLastBracket = line.lastIndexOf(')') - 2;
          const messagesString = line.substring(indexOfFirstBracket, indexOfLastBracket);
          const messages = messagesString.split('", "');
          item.messages = {};
          for (let msgIndex = 0; msgIndex < messages.length / 2; msgIndex++) {
            const groupIndex = msgIndex * 2;
            const key = messages[groupIndex];
            const value = messages[groupIndex + 1];
            item.messages[key.trim()] = value.replace("\\'", "'").trim();
          }
          mode = 'locale';
          continue;
        }

        const matches = stringStartsWith(tresSeparator.subResource, line);
        if (!matches) {
          mode = 'head';
          continue;
        }

        if (mode == 'head') {
          const indexOfEqual = line.lastIndexOf('=') + 1;
          const indexOfEndSquare = line.lastIndexOf(']');
          const idString = line.substring(indexOfEqual, indexOfEndSquare);
          item.id = parseInt(idString);
          mode = 'messages';
        }
      }
    }

    this.isReady = true;
    return `${Object.keys(this._itemDetailMap).length} languages loaded, with ${
      Object.keys(this._itemDetailMap?.[defaultLocale]?.messages ?? {}).length
    } keys per language.`;
  };

  loadAssistantAppsLanguage = () => {
    const aaSrcFile = path.join(paths().intermediateFolder, IntermediateFile.assistantAppsLanguage);
    const jsonString = fs.readFileSync(aaSrcFile, 'utf-8');
    const langExportMap = JSON.parse(jsonString);
    for (const langExportKey of Object.keys(langExportMap)) {
      if (this._itemDetailMap[langExportKey]?.messages == null) {
        console.error(
          `Language "${langExportKey}" does not exist in LocalisationModule._itemDetailMap`,
        );
        continue;
      }

      const langMap = langExportMap[langExportKey];
      for (const langMapKey of Object.keys(langMap)) {
        const value = langMap[langMapKey];
        this._itemDetailMap[langExportKey].messages[langMapKey] = value;
      }
    }
  };

  getLanguageCodes = () =>
    Object.keys(this._itemDetailMap).filter((lang) => !excludeLangCodes.includes(lang));

  getTranslationMapForLocal = (locale: string): ILocalisation => {
    if (this._itemDetailMap[locale] == null) {
      console.error(`Locale '${locale}' does not exist`);
      return this._itemDetailMap[defaultLocale];
    }
    return this._itemDetailMap[locale];
  };

  getUITranslations = (locale: string): Record<string, string> => {
    let localLocal = locale;
    if (this._itemDetailMap[locale] == null) {
      console.error(`Locale '${locale}' does not exist`);
      localLocal = defaultLocale;
    }
    let messageMap = this._itemDetailMap[localLocal].messages;

    const uiLocalisationMap: Record<string, string> = {};
    for (const uiKey of Object.keys(UIKeys)) {
      const uiKeyString = UIKeys[uiKey];
      let message: string = messageMap[uiKeyString];
      if (UIKeysRemoveTrailingColon.includes(uiKeyString)) {
        const colonIndex = message.indexOf(':');
        if (colonIndex > 0) {
          message = message.substring(0, colonIndex);
        }
        const fancyColonIndex = message.indexOf('：');
        if (fancyColonIndex > 0) {
          message = message.substring(0, fancyColonIndex);
        }
      }
      if (UIKeysReplace0Param.includes(uiKeyString)) {
        message = message.replace('{0}', '');
      }
      if (UIKeysRemovePercent.includes(uiKeyString)) {
        message = message.replace('%', '');
      }
      if (UIKeysRemovePeriod.includes(uiKeyString)) {
        message = message.replace('.', '');
      }
      if (UIKeysRemoveNewline.includes(uiKeyString)) {
        message = message.replace('\n', '').replace('\r', '');
      }
      uiLocalisationMap[uiKeyString] = message.trim();
    }

    return uiLocalisationMap;
  };

  get = (id: string) => this._itemDetailMap[id];
}
