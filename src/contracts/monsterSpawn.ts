import type { IExternalResource } from './externalResource';

export interface IMonsterSpawnDetails {
  monster_form?: IExternalResource;
  world_monster?: IExternalResource;
  weight?: number;
  hour_min?: number;
  hour_max?: number;
}

export interface IMonsterSpawnDetailsEnhanced extends IMonsterSpawnDetails {
  overworldMonsterId?: string;
  monsterId?: string;
  // monster: IMonsterFormSimplified;
  percent: number;
  percentStr: string;
  available_specific_time?: boolean;
}

export interface IMonsterSpawn {
  id: string;
  habitat_name: string;
  habitat_overworld_chunks: Array<IExternalResource>;
  habitat_endless: boolean;
  min_team_size: number;
  max_team_size: number;
  num_species: number;
  species?: Array<IMonsterSpawnDetails>;
}

export interface IMonsterSpawnEnhanced extends IMonsterSpawn {
  habitat_name_localised: string;
  species_enhanced: Array<IMonsterSpawnDetailsEnhanced>;
  habitat_coords: Array<string>;
}

export interface IMonsterSpawnHabitatDetails {
  id: string;
  habitat_name_localised: string;
  overworldSprite?: string;
  percent: number;
  percentStr: string;
  hour_min?: number;
  hour_max?: number;
  available_specific_time?: boolean;
}
