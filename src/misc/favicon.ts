import { type FaviconOptions, favicons } from 'favicons';
import fs from 'fs/promises';
import path from 'path';

import { paths } from 'constants/paths';
import { site } from 'constants/site';
import { getBotPath, getConfig } from 'services/internal/configService';

export const generateFavicons = async () => {
  const publicFolder = path.join(getBotPath(), 'public');
  const faviconFolder = path.join(publicFolder, 'assets', 'favicon');

  const configuration: FaviconOptions = {
    path: '/assets/favicon/',
    appName: site.meta.appName,
    appShortName: site.meta.title,
    appDescription: site.meta.description,
    developerName: site.humans.kurt.name,
    developerURL: site.humans.kurt.website,
    lang: 'en-GB',
    background: site.theme.maskColour,
    theme_color: site.theme.colour,
    appleStatusBarStyle: 'black-translucent',
    display: 'standalone',
    orientation: 'any',
    scope: '/',
    start_url: '/?standalone=1',
    preferRelatedApplications: false,
    version: getConfig().packageVersion(),
    pixel_art: false,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      favicons: true,
      windows: false,
      yandex: false,
    },
  };

  try {
    const response = await favicons(
      path.join(faviconFolder, 'favicon.png'), //
      configuration,
    );

    await Promise.all(
      response.images
        .filter((image) => !image.name.includes('apple-touch-startup'))
        .map((image) => fs.writeFile(path.join(faviconFolder, image.name), image.contents)),
    );

    fs.copyFile(path.join(faviconFolder, 'favicon.ico'), path.join(publicFolder, 'favicon.ico'));

    const manifestContent = response.files[0].contents;
    const manifestFiles = ['manifest.webmanifest', 'manifest.json', 'site.webmanifest'];
    for (const manifestFile of manifestFiles) {
      await fs.writeFile(path.join(publicFolder, manifestFile), manifestContent);
    }
    const htmlContentLines: Array<string> = [];
    for (const htmlLine of response.html) {
      if (htmlLine.includes('"apple-touch-startup-image"')) continue;
      if (htmlLine.includes('"application-name"')) continue;
      if (htmlLine.includes('"theme-color"')) continue;
      if (htmlLine.includes('"image/x-icon"')) {
        htmlContentLines.push(htmlLine.replace('/assets/favicon/favicon.ico', '/favicon.ico'));
        continue;
      }
      if (htmlLine.includes('rel="manifest"')) {
        const manifestLine = htmlLine.replace('assets/favicon/', '');
        htmlContentLines.push(manifestLine.replace('manifest.webmanifest', 'manifest.json'));
        htmlContentLines.push(manifestLine.replace('manifest.webmanifest', 'site.webmanifest'));
        htmlContentLines.push(manifestLine);
        continue;
      }
      htmlContentLines.push(htmlLine);
    }
    await fs.writeFile(
      path.join(paths().templatesFolder, 'partials', 'favicon.hbs'),
      htmlContentLines.join('\n'),
    );
  } catch (error) {
    console.log((error as any).message);
  }
};
