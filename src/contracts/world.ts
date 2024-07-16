import { IExternalResource } from './externalResource';
import { ISubResource, ISubResourceMapEnhanced } from './subResource';

export interface IWorld {
  id: string;
  title: string;
  map_texture: IExternalResource;
  map_obscure: IExternalResource;
  map_background: IExternalResource;
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
  features: Array<ISubResource>;
}

export interface IWorldMetaDataEnhanced extends IWorldMetaData {
  id: string;
  title_localised: string;
  features_localised: Array<ISubResourceMapEnhanced>;
}
