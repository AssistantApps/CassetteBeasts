import { chineseLocale, japaneseLocale, koreanLocale } from './localisation';

export interface IFontFile {
  file: string;
  name: string;
}

export const fontMetas: { [prop: string]: Array<IFontFile> } = {
  default: [
    {
      file: './assets/font/Neu5Land_Norm.ttf',
      name: 'Neu5Land',
    },
    // {
    //   file: './assets/font/Roboto-Bold.ttf',
    //   name: 'Roboto',
    // },
  ],
  [koreanLocale]: [
    {
      file: './assets/font/Laundry_Gothic_Regular.ttf',
      name: 'Neu5Land',
    },
  ],
  [japaneseLocale]: [
    {
      file: './assets/font/regular.NotoSansJP-Bold.ttf',
      name: 'Neu5Land',
    },
  ],
  [chineseLocale]: [],
} as const;
