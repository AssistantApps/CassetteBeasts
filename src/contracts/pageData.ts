import { site } from 'constant/site';
import { IBreadcrumb } from './breadcrumb';

export type PageData<T> = typeof site & {
  humansArray: Array<string>;
  analyticsCode: string;
  version: string;
  documentTitle?: string;
  documentTitleUiKey?: string;
  alternateUrls: Array<string>;
  breadcrumbs: Array<IBreadcrumb>;
  translate: Record<string, string>;
  routes: Record<string, string>;
  langCode: string;
  availableLanguages: Array<{ id: string; name: string }>;
  data: T;
};
