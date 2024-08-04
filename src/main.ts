import 'reflect-metadata';

import path from 'path';
import Container from 'typedi';
import url from 'url';

import { generateFavicons } from 'misc/favicon';
import { smartLoadingModules } from 'misc/moduleLoader';
import { validateModules } from 'misc/moduleValidator';
import { languagePrompt, mainMenu, yesOrNoPrompt } from 'misc/setup';
import { getModules } from 'modules';
import { BOT_PATH } from 'services/internal/configService';
import { getHandlebar } from 'services/internal/handlebarService';

const currentFileName = url.fileURLToPath(import.meta.url);
const directory = path.dirname(currentFileName);
const rootDirectory = path.join(directory, '../');

const main = async () => {
  Container.set(BOT_PATH, rootDirectory);
  console.log('Starting up');

  console.log('Initialising modules');
  const [localisationModule, modules] = await getModules({});

  const isValid = validateModules(modules);
  if (!isValid) return 1;

  const availableLanguages = localisationModule.getLanguageCodes();
  let langCode = availableLanguages[0];
  await smartLoadingModules({ langCode, modules });
  console.log('✔ Done\r\n');

  let repeatMenuOptions = true;

  const menuLookup: { [key: string]: () => Promise<void> } = {
    changeLanguage: async () => {
      const newLang = await languagePrompt(availableLanguages);
      if (newLang == null) return;
      langCode = newLang;
      console.log('Re-Initialising modules');
      await smartLoadingModules({ langCode, modules });
      console.log('✔ Done\r\n');
    },
    createIntermediateFiles: async () => {
      for (const module of modules) {
        await module.writeIntermediate(langCode);
      }
    },
    copyImagesFromGameFiles: async () => {
      getHandlebar().unregisterPartialsAndHelpers();
      getHandlebar().registerPartialsAndHelpers();
      const overwrite = await yesOrNoPrompt('Overwrite existing images?');
      for (const module of modules) {
        await module.getImagesFromGameFiles(overwrite);
      }
    },
    generateImagesQuickly: async () => {
      getHandlebar().unregisterPartialsAndHelpers();
      getHandlebar().registerPartialsAndHelpers();
      for (const module of modules) {
        await module.generateImages(false, modules);
        await module.generateMetaImages(langCode, localisationModule, false);
      }
    },
    generateFavicons,
    generateAllImages: async () => {
      getHandlebar().unregisterPartialsAndHelpers();
      getHandlebar().registerPartialsAndHelpers();
      const overwrite = await yesOrNoPrompt('Overwrite existing images?');

      for (const module of modules) {
        await module.generateImages(overwrite, modules);
      }

      for (const availableLanguage of availableLanguages) {
        langCode = availableLanguage;
        console.log(`Re-Initialising modules (for ${langCode})`);
        await smartLoadingModules({
          langCode, //
          modules,
          reInitialise: true,
        });
        for (const module of modules) {
          await module.generateMetaImages(langCode, localisationModule, overwrite);
        }
        console.log('');
      }
    },
    copyWavFiles: async () => {
      const overwrite = await yesOrNoPrompt('Overwrite existing wav files?');
      for (const module of modules) {
        await module.copyWav(overwrite);
      }
    },
    exit: async () => {
      repeatMenuOptions = false;
    },
  };

  while (repeatMenuOptions) {
    console.debug(`selectedLanguage : ${langCode}`);
    console.debug('----------------------------------------');
    await mainMenu(menuLookup, () => {
      repeatMenuOptions = false;
    });
  }
};

main();
