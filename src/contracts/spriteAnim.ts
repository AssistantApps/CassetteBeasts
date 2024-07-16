import { IBoxSelection } from './boxSelection';

export interface ISpriteAnimDetails {
  id: number;
  length: number;
  loop: boolean;
  frames: Array<IBoxSelection>;
}

export interface ISpriteAnim {
  name: string;
  animations: Array<ISpriteAnimDetails>;
}

export interface ISpriteAnimDetailsEnhanced {
  id: number;
  length: number;
  loop: boolean;
  frames: Array<IBoxSelection>;
  imageUrl: string;
}

export interface ISpriteAnimEnhanced {
  id: number;
  url: string;
}
