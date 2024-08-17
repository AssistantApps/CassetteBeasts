import type { IExternalResource } from './externalResource';
import type { IMonsterFormSimplified } from './monsterForm';
import type { IMonsterSpawnDetailsEnhanced } from './monsterSpawn';
import type { ISubResource, ISubResourceMapEnhanced } from './subResource';
import type { IRect2, IVector2D } from './vector';

export interface IWorld {
  id: string;
  title: string;
  map_texture?: IExternalResource;
  map_obscure?: IExternalResource;
  map_background?: IExternalResource;
  chunk_layout?: IRect2;
  texels_per_world_unit?: IVector2D;
  chunk_metadata_path: string;
  default_chunk_metadata?: ISubResource;
  chunk_meta_data: Record<string, IWorldMetaData>;
}

export interface IWorldEnhanced extends IWorld {
  title_localised: string;
  default_chunk_metadata_title_localised: string;
  numOfColumns: number;
  numOfRows: number;
  chunk_meta_data_localised: Array<Array<IWorldMetaDataEnhanced>>;
}

export interface IWorldMetaData {
  title: string;
  features?: Array<ISubResource>;
}

export interface IWorldMetaDataEnhanced extends IWorldMetaData {
  id: string;
  title_localised: string;
  features_localised: Array<ISubResourceMapEnhanced>;
  monster_in_habitat: Array<IMonsterFormSimplified>;
  species_in_this_zone: Array<IMonsterSpawnDetailsEnhanced>;
}
