import { site } from 'constant/site';
import type { IBreadcrumb } from './breadcrumb';

export interface IAlternateUrl {
  href: string;
  lang: string;
}

export type PageData<T> = typeof site & {
  humansArray: Array<string>;
  analyticsCode: string;
  version: string;
  relativePath?: string;
  documentTitle?: string;
  documentTitleUiKey?: string;
  alternateUrls: Array<IAlternateUrl>;
  breadcrumbs: Array<IBreadcrumb>;
  translate: Record<string, string>;
  routes: Record<string, string>;
  langCode: string;
  availableLanguages: Array<{ id: string; name: string }>;
  data: T;
};
