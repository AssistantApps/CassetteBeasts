import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import sitemap from '@astrojs/sitemap';
import { site } from './src/constants/site';

// https://astro.build/config
export default defineConfig({
  site: site.rootUrl,
  compressHTML: false, // TODO replace after comparison with handlebarJS version
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
  ],
});
