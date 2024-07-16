import { IExternalResource } from 'contracts/externalResource';
import { ISubResource } from 'contracts/subResource';
import { tryParseInt } from 'helpers/mathHelper';
import { getExternalResource, getExternalResources } from './externalResourceMapper';
import { getCleanedString, stringToBool } from 'helpers/stringHelper';

export const subResourceMapper = (line: string): ISubResource | undefined => {
  const regex = /\stype=\"(.+?)\"\sid=(\d+)/;
  const matches = regex.exec(line);
  if ((matches?.length ?? 0) != 3) return;

  return {
    id: parseInt(matches[2]),
    type: matches[1],
  };
};

export const subResourceFromDetailList = (props: {
  subResourceMapItem: Record<string, string>;
  externalResourcesMap: Record<number, IExternalResource>;
}): ISubResource => {
  return {
    id: tryParseInt(props.subResourceMapItem['id']),
    type: props.subResourceMapItem['type'],
    title: getCleanedString(props.subResourceMapItem['title']),
    icon: getExternalResource(props.subResourceMapItem['icon'], props.externalResourcesMap),
    resource_name: getCleanedString(props.subResourceMapItem['resource_name']),
    evolved_form: getExternalResource(
      props.subResourceMapItem['evolved_form'],
      props.externalResourcesMap,
    ),
    required_tape_grade: tryParseInt(props.subResourceMapItem['required_tape_grade']),
    min_hour: tryParseInt(props.subResourceMapItem['min_hour']),
    max_hour: tryParseInt(props.subResourceMapItem['max_hour']),
    required_location: getCleanedString(props.subResourceMapItem['required_location']),
    required_move: getExternalResource(
      props.subResourceMapItem['required_move'], //
      props.externalResourcesMap,
    ),
    specialization: getCleanedString(props.subResourceMapItem['specialization']),
    is_secret: stringToBool(props.subResourceMapItem['is_secret']),
    add_slot: stringToBool(props.subResourceMapItem['add_slot']),
    sticker: getExternalResource(
      props.subResourceMapItem['sticker'], //
      props.externalResourcesMap,
    ),
    form: getExternalResource(props.subResourceMapItem['form'], props.externalResourcesMap),
    grade: tryParseInt(props.subResourceMapItem['grade']),
    seed_value: tryParseInt(props.subResourceMapItem['seed_value']),
    stickers: getExternalResources(
      props.subResourceMapItem['stickers'], //
      props.externalResourcesMap,
    ),
    type_override: getExternalResources(
      props.subResourceMapItem['type_override'], //
      props.externalResourcesMap,
    ),
    exp_points: tryParseInt(props.subResourceMapItem['exp_points']),
    favorite: stringToBool(props.subResourceMapItem['favorite']),
  };
};

export const getSubResource = (
  line: string,
  subResourcesMap: Record<number, ISubResource>,
): ISubResource => {
  if (line == null || line.length < 1) return;
  const searchWord = 'SubResource(';
  const indexOfResource = line.indexOf(searchWord);
  if (indexOfResource < 0) return;

  const indexOfLastBracket = line.lastIndexOf(')');
  const idString = line.substring(indexOfResource + searchWord.length, indexOfLastBracket);
  const id = parseInt(idString);
  return subResourcesMap[id];
};

export const getSubResources = (
  line: string,
  subResourcesMap: Record<number, ISubResource>,
): Array<ISubResource> =>
  line.split(', ').map((subLine) => getSubResource(subLine, subResourcesMap));
