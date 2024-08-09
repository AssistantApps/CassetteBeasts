import type { IExternalResource } from 'contracts/externalResource';
import { getExternalResource, getExternalResources } from 'contracts/mapper/externalResourceMapper';
import type { IMonsterFormEnhanced } from 'contracts/monsterForm';
import type { IMonsterSpawn, IMonsterSpawnDetails } from 'contracts/monsterSpawn';
import type { IMove, IMoveEnhanced } from 'contracts/move';
import type { ISubAnimationResource } from 'contracts/subAnimationResource';
import type { ISubResource, ISubResourceMonsterEnhanced } from 'contracts/subResource';
import { tryParseFloat, tryParseInt } from 'helpers/mathHelper';
import { getCleanedString, resAndTresTrim, stringToBool } from 'helpers/stringHelper';
import type { CommonModule } from 'modules/commonModule';

export const monsterSpawnMapFromDetailList =
  (id: string) =>
  (props: {
    resourceMap: Record<string, string>;
    subResourceMap: Record<string, ISubResource>;
    externalResourcesMap: Record<number, IExternalResource>;
    subAnimationResourceMap: Record<number, ISubAnimationResource>;
  }): IMonsterSpawn => {
    const species: Array<IMonsterSpawnDetails> = [];
    const num_species = tryParseInt(props.resourceMap['num_species']) ?? 0;
    for (let index = 0; index < num_species; index++) {
      species.push({
        hour_max: tryParseInt(props.resourceMap[`species_${index}/hour_max`]),
        hour_min: tryParseInt(props.resourceMap[`species_${index}/hour_min`]),
        weight: tryParseFloat(props.resourceMap[`species_${index}/weight`]),
        world_monster: getExternalResource(
          props.resourceMap[`species_${index}/world_monster`], //
          props.externalResourcesMap,
        ),
        monster_form: getExternalResource(
          props.resourceMap[`species_${index}/monster_form`], //
          props.externalResourcesMap,
        ),
      });
    }

    return {
      id,
      habitat_name: getCleanedString(props.resourceMap['habitat_name']),
      habitat_overworld_chunks: getExternalResources(
        props.resourceMap['habitat_overworld_chunks'], //
        props.externalResourcesMap,
      ),
      habitat_endless: stringToBool(props.resourceMap['habitat_endless']),
      min_team_size: tryParseInt(props.resourceMap['min_team_size']) ?? 0,
      max_team_size: tryParseInt(props.resourceMap['max_team_size']) ?? 0,
      num_species,
      species,
    };
  };

export const getEvolutionMonster = (
  language: Record<string, string>,
  resource: ISubResource,
  moveModule: CommonModule<IMove, IMoveEnhanced>,
  monsterDetails: IMonsterFormEnhanced,
): ISubResourceMonsterEnhanced | undefined => {
  if (monsterDetails == null) return;
  return {
    ...resource,
    icon_url: monsterDetails.icon_url,
    name_localised: monsterDetails.name_localised,
    bestiary_index_with_padding: monsterDetails.bestiary_index_with_padding,
    elemental_types_elements: monsterDetails.elemental_types_elements,
    required_move_move: moveModule.get(resAndTresTrim(resource?.required_move?.path ?? '')),
    specialization_localised: language[resource.specialization ?? ''],
  };
};
