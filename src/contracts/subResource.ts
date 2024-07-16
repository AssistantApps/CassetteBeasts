import { IElement } from './element';
import { IExternalResource } from './externalResource';
import { IMove } from './move';

export interface ISubResource {
  id: number;
  type: string;
  title?: string;
  icon?: IExternalResource;
  resource_name?: string;
  evolved_form?: IExternalResource;
  required_tape_grade?: number;
  min_hour?: number;
  max_hour?: number;
  required_location?: string;
  required_move?: IExternalResource;
  specialization?: string;
  is_secret?: boolean;
  add_slot?: boolean;
  sticker?: IExternalResource;
  form?: IExternalResource;
  grade?: number;
  seed_value?: number;
  type_override?: Array<IExternalResource>;
  // type_native: Array<unknown>
  stickers?: Array<IExternalResource>;
  // stat_increments: unknown;
  exp_points?: number;
  favorite?: boolean;
}

export interface ISubResourceMonsterEnhanced extends ISubResource {
  icon_url: string;
  name_localised: string;
  bestiary_index_with_padding: string;
  elemental_types_elements: Array<IElement>;
  required_move_move?: IMove;
  specialization_localised?: string;
}

export interface ISubResourceMapEnhanced extends ISubResource {
  icon_url: string;
  title_localised: string;
}
