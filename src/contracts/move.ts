import { IElement } from './element';
import { IExternalResource } from './externalResource';
import { IMonsterForm } from './monsterForm';
import { IStatusEffect } from './statusEffect';

export interface IMove {
  id: string;
  name: string;
  category_name: string;
  description: string;
  title_override: string;
  tags: Array<string>;
  priority: number;
  cost: number;
  is_passive_only: boolean;
  power: number;
  physicality: number;
  target_type: number;
  default_target: number;
  elemental_types: Array<IExternalResource>;
  accuracy: number;
  unavoidable: boolean;
  crit_rate_numerator: number;
  crit_rate_denominator: number;
  crit_damage_percent: number;
  // play_attack_animation: boolean;
  // fade_lights_during_attack: boolean;
  // windup_animation: string;
  // attack_animation: string;
  // windup_sfx_override = [  ]
  // attack_vfx = [  ]
  // play_attack_vfx_against_allies: boolean;
  attack_duration: number;
  // hit_vfx = [  ]
  hit_delay: number;
  disable_melee_movement: boolean;
  can_be_copied: boolean;
  // attribute_profile = ExtResource( 4 )
  // camera_state_override:string;
  status_effects: Array<IExternalResource>;
  amount: number;
  // varied_amounts = [  ]
  status_effects_to_apply: number;
  num_at_random: number;
  fail_if_already_present: boolean;
  fail_against_archangels: boolean;
  fail_if_has_tag: string;
  sacrifice_hp_percent: number;
  chance: number;
}

export interface IMoveEnhanced extends IMove {
  name_localised: string;
  category_name_localised: string;
  description_localised: string;
  title_override_localised: string;
  monsters_that_can_learn: Array<IMonsterForm>;
  elemental_types_elements: Array<IElement>;
  status_effects_elements: Array<IStatusEffect>;
  meta_image_url: string;
}

export interface IMoveSimplified {
  id: string;
  name_localised: string;
  category_name_localised: string;
  power: number;
  accuracy: number;
  elemental_types_elements: Array<IElement>;
}
