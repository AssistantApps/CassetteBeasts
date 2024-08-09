import type { INodeResource, INodeResourceEnhanced } from './nodeResource';

export interface IFusion {
  id: string;
  nodes?: Record<string, INodeResource>;
}

export interface IFusionEnhanced extends IFusion {
  nodes_enhanced: Record<string, INodeResourceEnhanced>;
}
