import 'reflect-metadata';

import path from 'path';
import Container from 'typedi';
import url from 'url';

import { TemplateGenerationSpeed } from 'constant/handlebar';
import { generateFavicons } from 'misc/favicon';
import { smartLoadingModules } from 'misc/moduleLoader';
import { validateModules } from 'misc/moduleValidator';
import {
  languagePrompt,
  mainMenu,
  setupDirectories,
  templateGenerationSpeedPrompt,
  yesOrNoPrompt,
} from 'misc/setup';
import { watchDevFiles } from 'misc/watchDevFiles';
import { getModules } from 'modules';
import { BOT_PATH } from 'services/internal/configService';
import { getHandlebar } from 'services/internal/handlebarService';
import { generateSiteMap } from 'misc/sitemap';

const currentFileName = url.fileURLToPath(import.meta.url);
const directory = path.dirname(currentFileName);
const rootDirectory = path.join(directory, '../');

const main = async () => {
  Container.set(BOT_PATH, rootDirectory);
  console.log('Starting up');
  setupDirectories({ delete: false });

  console.log('Initialising modules');
  const [localisationModule, modules] = await getModules({});

  const isValid = validateModules(modules);
  if (!isValid) return 1;

  const availableLanguages = localisationModule.getLanguageCodes();
  let langCode = availableLanguages[0];
  await smartLoadingModules({ langCode, modules });
  console.log('✔ Done\r\n');

  let repeatMenuOptions = true;

  const imageMenuLookup: { [key: string]: () => Promise<void> } = {
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
          loadFromJson: true,
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
    exit: async () => {},
  };
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
      setupDirectories({ delete: true });
      for (const module of modules) {
        await module.writeIntermediate();
      }
    },
    generateSiteMap: async () => {
      getHandlebar().unregisterPartialsAndHelpers();
      getHandlebar().registerPartialsAndHelpers();
      await generateSiteMap();
    },
    manageAssets: async () => {
      await mainMenu(imageMenuLookup, () => {});
    },
    createPages: async () => {
      getHandlebar().unregisterPartialsAndHelpers();
      getHandlebar().registerPartialsAndHelpers();
      for (const module of modules) {
        await module.writePages(langCode, modules);
      }
    },
    watchPagesExit: async () => {
      const templateGenerationSpeed = await templateGenerationSpeedPrompt(
        'What template generation strategy do you want to use?',
      );
      console.log('\tWatching templates folder');
      watchDevFiles({
        onTemplateChange: (templateChange: string) => {
          if (templateGenerationSpeed == TemplateGenerationSpeed.Speedy) {
            getHandlebar().setAllowedTemplatesToCompile([templateChange]);
          }
          getHandlebar().clearGitIgnore();
          getHandlebar().unregisterPartialsAndHelpers();
          getHandlebar().registerPartialsAndHelpers();
          for (const module of modules) {
            module.writePages(langCode, modules);
          }
        },
      });

      repeatMenuOptions = false;
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
