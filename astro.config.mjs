import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { minify } from '@zokki/astro-minify';
import metaTags from 'astro-meta-tags';
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
    react(),
    metaTags(),
    robotsTxt(),
    sitemap({
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date(),
    }),
    minify({
      html: {
        drop_console: true,
        drop_debugger: true,
        removeComments: true,
        noNewlinesBeforeTagClose: true,
        preserveLineBreaks: false,
        keep_closing_tags: true,
      },
      js: {
        minify: true,
        minifyWhitespace: true,
      },
      css: {
        minify: true,
      },
    }),
  ],
});
