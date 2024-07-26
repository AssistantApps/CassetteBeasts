import { IExternalResource } from './externalResource';
import { IMonsterFormSimplified } from './monsterForm';

export interface IMonsterSpawnDetails {
  monster_form: IExternalResource;
  monster_form_percent: number;
  world_monster: IExternalResource;
  world_monster_percent: number;
  weight: number;
  hour_min: number;
  hour_max: number;
  available_specific_time: boolean;
}

export interface IMonsterSpawnDetailsEnhanced extends IMonsterSpawnDetails {
  monster_form_monster: IMonsterFormSimplified;
  world_monster_monster: IMonsterFormSimplified;
}

export interface IMonsterSpawn {
  id: string;
  habitat_name: string;
  habitat_overworld_chunks: IExternalResource;
  habitat_endless: boolean;
  min_team_size: number;
  max_team_size: number;
  num_species: number;
  species: Array<IMonsterSpawnDetails>;
}

export interface IMonsterSpawnEnhanced extends IMonsterSpawn {
  habitat_name_localised: string;
  species_enhanced: Array<IMonsterSpawnDetailsEnhanced>;
}

export interface IMonsterSpawnHabitatDetails {
  overworld: boolean;
  percent: number;
  hour_min: number;
  hour_max: number;
  available_specific_time: boolean;
}
