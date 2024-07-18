import { INodeResource, INodeResourceEnhanced } from './nodeResource';

export interface IFusion {
  id: string;
  nodes: Record<number, INodeResource>;
}

export interface IFusionEnhanced extends IFusion {
  nodes_enhanced: Record<number, INodeResourceEnhanced>;
}
