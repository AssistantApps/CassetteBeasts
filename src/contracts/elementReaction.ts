import type { IElement } from './element';
import type { IExternalResource } from './externalResource';
import type { IStatusEffect } from './statusEffect';

export interface IElementReaction {
  id: string;
  attacker: IExternalResource;
  defender: IExternalResource;
  result: Array<IExternalResource>;
  varied_result_amount: Array<number>;
  default_result_amount: number;
  result_hint: number;
  toast_message: string;
}

export interface IElementReactionEnhanced extends IElementReaction {
  attacker_element: IElement;
  defender_element: IElement;
  result_status_effect: Array<IStatusEffect>;
  toast_message_localised: string;
}

export interface IElementGridCell {
  id: string;
  iconUrl?: string;
  name?: string;
  is_buff: boolean;
  is_debuff: boolean;
  message?: string;
  buffs: Array<IStatusEffect>;
}
