import type { IExternalResource } from './externalResource';

export interface IElement {
  id: string;
  name: string;
  sort_order: number;
  //   palette: string;
  //   vfx_palette: string;
  sparkle: boolean;
  icon?: IExternalResource;
  loot_table: string;
}

export interface IElementEnhanced extends IElement {
  name_localised: string;
}
