import 'reflect-metadata';

import path from 'path';
import Container from 'typedi';
import url from 'url';

import { generateFavicons } from 'misc/favicon';
import { smartLoadingModules } from 'misc/moduleLoader';
import { generateMainCss } from 'misc/sass';
import { setupDirectories } from 'misc/setup';
import { getModules } from 'modules';
import { BOT_PATH } from 'services/internal/configService';
import { getHandlebar } from 'services/internal/handlebarService';

const currentFileName = url.fileURLToPath(import.meta.url);
const directory = path.dirname(currentFileName);
const rootDirectory = path.join(directory, '../');

const main = async () => {
  Container.set(BOT_PATH, rootDirectory);
  console.log('Starting up');
  setupDirectories({ delete: false });

  console.log('Initialising modules');
  const [localisationModule, modules] = await getModules({ loadFromJson: true });
  getHandlebar().clearGitIgnore();
  getHandlebar().unregisterPartialsAndHelpers();
  getHandlebar().registerPartialsAndHelpers();

  await generateFavicons();
  generateMainCss();

  const availableLanguages = localisationModule.getLanguageCodes();
  let langCode = availableLanguages[0];
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
      await module.generateImages(true, modules);
    }

    for (const module of modules) {
      await module.writePages(langCode, modules);
    }

    for (const module of modules) {
      await module.generateMetaImages(langCode, localisationModule, false);
    }
    console.log('');
  }

  getHandlebar().generateGitIgnore();
  console.log('✔ Done\r\n');
};

main();
