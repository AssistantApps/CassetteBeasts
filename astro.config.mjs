import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import compressor from 'astro-compressor';
import metaTags from 'astro-meta-tags';
import purgecss from 'astro-purgecss';
import robotsTxt from 'astro-robots-txt';
import { defineConfig } from 'astro/config';

import { site } from './src/constants/site';

// https://astro.build/config
export default defineConfig({
  site: site.rootUrl,
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',
      'fr_FR',
      'it_IT',
      'de_DE',
      'es_ES',
      'zh_CN',
      'ja_JP',
      'ko_KR',
      'es_MX',
      'pt_BR',
    ],
  },
  routing: {
    prefixDefaultLocale: false,
  },
  build: {
    format: 'preserve',
    assets: 'astro',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date(),
    }),
    solidJs(),
    metaTags(),
    robotsTxt(),
    purgecss(),
    compressor(),
  ],
});
