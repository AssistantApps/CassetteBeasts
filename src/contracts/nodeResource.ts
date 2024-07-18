import { IExternalResource } from './externalResource';
import { ISpriteAnimDetailsEnhanced } from './spriteAnim';
import { IVector2D } from './vector';

export interface INodeResourceHead {
  name: string;
  type: string;
  parent: string;

  // child specific props
  instance?: string;
  instance_external?: IExternalResource;
}

export interface INodeResource extends INodeResourceHead {
  visible: boolean;
  force_usage: boolean;
  inverse_match: boolean;
  position: IVector2D;
  match_part: string;
  child?: Record<string, INodeResource>;
}

export interface INodeResourceEnhanced extends INodeResource {
  instance_external_path: string;
}
