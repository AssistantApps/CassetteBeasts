import { IExternalResource } from './externalResource';
import { IMoveSimplified } from './move';

export interface IStatusEffect {
  id: string;
  name: string;
  description: string;
  has_duration: boolean;
  reduce_duration_at: number;
  icon: IExternalResource;
  is_removable: boolean;
  is_buff: boolean;
  is_debuff: boolean;
  is_decoy: boolean;
  always_hidden_from_display: boolean;
  tags: Array<string>;
  toast_on_remove: string;
  //   vfx_on_add: string;
  //   vfx_on_remove: string;
  name_modifier: string;
  sprite_animation_prefix: string;
  sprite_animation_prefix_priority: string;
  stats_affected: Array<string>;
  stat_offset: number;
}

export interface IStatusEffectEnhanced extends IStatusEffect {
  name_localised: string;
  description_localised: string;
  toast_on_remove_localised: string;
  name_modifier_localised: string;
  meta_image_url: string;
  moves_that_cause_this_effect: Array<IMoveSimplified>;
}
