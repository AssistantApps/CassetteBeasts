import fs from 'fs';
import path from 'path';
import readline from 'readline';

import { IntermediateFile } from 'constants/intermediateFile';
import {
  UIKeys,
  UIKeysRemoveNewline,
  UIKeysRemovePercent,
  UIKeysRemovePeriod,
  UIKeysRemoveTrailingColon,
  UIKeysReplace0Param,
  defaultLocale,
  excludeLangCodes,
} from 'constants/localisation';
import { ModuleType } from 'constants/module';
import { paths } from 'constants/paths';
import { tresSeparator } from 'constants/tresSeparator';
import type { ILocalisation } from 'contracts/localisation';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { pad, stringStartsWith } from 'helpers/stringHelper';
import { CommonModule } from 'modules/commonModule';

export class LocalisationModule extends CommonModule<ILocalisation, ILocalisation> {
  _keysToKeep: Record<string, string> = {};
  _aaItemDetailMap: Record<string, Record<string, string>> = {};

  constructor() {
    super({
      type: ModuleType.Localisation,
      intermediateFile: IntermediateFile.language,
      loadOnce: true,
      dependsOn: [ModuleType.AssistantApps],
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
      let mode: 'none' | 'head' | 'messages' | 'locale' | undefined;
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

    return `${pad(Object.keys(this._itemDetailMap).length, 3, ' ')} languages loaded, with ${
      Object.keys(this._itemDetailMap?.[defaultLocale]?.messages ?? {}).length
    } keys per language.`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const aaModule = this.getModuleOfType<ILocalisation>(modules, ModuleType.AssistantApps);
    for (const locale of this.getLanguageCodes()) {
      const allMessages = aaModule.get(locale).messages;
      this._aaItemDetailMap[locale] = { ...allMessages };
    }

    this.isReady = true;
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
      const uiKeyString = (UIKeys as Record<string, string>)[uiKey];
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

    for (const localisationKey of Object.keys(messageMap)) {
      if (localisationKey.includes('LANG_') == false) continue;

      let message: string = messageMap[localisationKey];
      uiLocalisationMap[localisationKey] = message.trim();
    }

    return uiLocalisationMap;
  };

  get = (id: string) => this._itemDetailMap[id];

  translate = (locale: string, key: string): string => {
    this._keysToKeep[key] = key;
    const localisation = this._itemDetailMap[locale];
    if (localisation == null) return key;

    return localisation.messages[key];
  };

  initFromIntermediate = async () => {
    const srcFile = path.join(paths().intermediateFolder, this.intermediateFile);
    const jsonString = fs.readFileSync(srcFile, 'utf-8');
    this._itemDetailMap = JSON.parse(jsonString);
  };

  writeIntermediate = () => {
    const destFile = path.join(paths().intermediateFolder, this.intermediateFile);

    const newItemDetailMap: Record<string, ILocalisation> = {};
    for (const locale of this.getLanguageCodes()) {
      const existingMessages = this._itemDetailMap[locale].messages;
      const filteredMessages: Record<string, string> = {};
      for (const existingMessageKey of Object.keys(existingMessages)) {
        // if (this._keysToKeep[existingMessageKey] == null) continue;
        filteredMessages[existingMessageKey] = existingMessages[existingMessageKey];
      }

      const uiTranslations = this.getUITranslations(locale);
      for (const uiTransKey of Object.keys(uiTranslations)) {
        const uiTransValue = uiTranslations[uiTransKey];
        filteredMessages[uiTransKey] = uiTransValue;
      }

      const aaMessages = this._aaItemDetailMap[locale];
      for (const aaTransKey of Object.keys(aaMessages)) {
        const aaTransValue = aaMessages[aaTransKey];
        filteredMessages[aaTransKey] = aaTransValue;
      }

      newItemDetailMap[locale] = {
        id: this._itemDetailMap[locale].id,
        locale: this._itemDetailMap[locale].locale,
        messages: filteredMessages,
      };
    }

    fs.writeFileSync(destFile, JSON.stringify(newItemDetailMap, null, 2), 'utf-8');
  };
}
