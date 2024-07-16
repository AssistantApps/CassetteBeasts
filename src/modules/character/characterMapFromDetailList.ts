import { ICharacter } from 'contracts/character';
import { IExternalResource } from 'contracts/externalResource';
import { ISubAnimationResource } from 'contracts/subAnimationResource';
import { ISubResource } from 'contracts/subResource';
import { tryParseInt } from 'helpers/mathHelper';
import { getCleanedString, stringToBool } from 'helpers/stringHelper';
import { getExternalResource, getExternalResources } from 'mapper/externalResourceMapper';
import { getSubResources } from 'mapper/subResourceMapper';

export const characterMapFromDetailList = (props: {
  resourceMap: Record<string, string>;
  subResourceMap: Record<string, ISubResource>;
  externalResourcesMap: Record<number, IExternalResource>;
  subAnimationResourceMap: Record<number, ISubAnimationResource>;
}): ICharacter => {
  const directSubResourceMap = props.subResourceMap['1'] as ISubResource;
  return {
    id: getCleanedString(props.resourceMap['id']),
    name: getCleanedString(props.resourceMap['name']),
    resource_name: getCleanedString(props.resourceMap['resource_name']),
    exp_yield: tryParseInt(props.resourceMap['exp_yield']),
    require_dlc: stringToBool(props.resourceMap['require_dlc']),
    battle_sprite: getExternalResource(
      props.resourceMap['battle_sprite'],
      props.externalResourcesMap,
    ),
    character_kind: tryParseInt(props.resourceMap['character_kind']),
    force_unrecordable: stringToBool(props.resourceMap['force_unrecordable']),
    human_colors: getCleanedString(props.resourceMap['human_colors']),
    level: tryParseInt(props.resourceMap['level']),
    max_ap: tryParseInt(props.resourceMap['max_ap']),
    ap_regen: tryParseInt(props.resourceMap['base_ap_regen']),
    max_hp: tryParseInt(props.resourceMap['base_max_hp']),
    melee_attack: tryParseInt(props.resourceMap['base_melee_attack']),
    melee_defense: tryParseInt(props.resourceMap['base_melee_defense']),
    ranged_attack: tryParseInt(props.resourceMap['base_ranged_attack']),
    ranged_defense: tryParseInt(props.resourceMap['base_ranged_defense']),
    speed: tryParseInt(props.resourceMap['base_speed']),
    accuracy: tryParseInt(props.resourceMap['base_accuracy']),
    tapes: [
      ...getSubResources(props.resourceMap['tapes'], props.subResourceMap),
      ...getExternalResources(props.resourceMap['tapes'], props.externalResourcesMap),
    ].filter((res) => res != null),
    evasion: tryParseInt(props.resourceMap['base_evasion']),
    team_name_override: getCleanedString(props.resourceMap['team_name_override']),
    exp_gradient: tryParseInt(props.resourceMap['exp_gradient']),
    exp_base_level: tryParseInt(props.resourceMap['exp_base_level']),
    partner_id: getCleanedString(props.resourceMap['partner_id']),
    partner_signature_species: getExternalResource(
      props.resourceMap['partner_signature_species'],
      props.externalResourcesMap,
    ),
    partner_signature_species_type_override: directSubResourceMap?.['type_override']?.[0],
    sfx: getExternalResource(props.resourceMap['sfx'], props.externalResourcesMap),
    portraits: [],
  };
};
