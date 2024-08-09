import type { IBoxSelection } from 'contracts/boxSelection';
import type { ISubAnimationResource } from 'contracts/subAnimationResource';
import type { ISubResource } from 'contracts/subResource';
import { tryParseFloat, tryParseInt } from 'helpers/mathHelper';
import { stringStartsWith, stringToBool } from 'helpers/stringHelper';

export const subAnimResourceMapper = (line: string): ISubResource | undefined => {
  const regex = /\stype=\"(.+?)\"\sid=(\d+)/;
  const matches = regex.exec(line);
  if ((matches?.length ?? 0) != 3) return;

  return {
    id: parseInt(matches![2]),
    type: matches![1],
  };
};

export const subAnimResourceFromDetailList = (props: {
  subAnimationResourceMapItem: Record<string, string>;
}): ISubAnimationResource => {
  const tracks_key_lines = props.subAnimationResourceMapItem['tracks/0/keys']
    .split('\n')
    .filter((tkl) => stringStartsWith('"values": [', tkl));
  let sprite_frame_coords: Array<IBoxSelection> = [];
  if (tracks_key_lines.length === 1) {
    sprite_frame_coords = getBoxSelections(tracks_key_lines[0]);
  }

  return {
    id: tryParseInt(props.subAnimationResourceMapItem['id'])!,
    type: props.subAnimationResourceMapItem['type'],
    length: tryParseFloat(props.subAnimationResourceMapItem['length'])!,
    loop: stringToBool(props.subAnimationResourceMapItem['loop']),
    tracks_type: props.subAnimationResourceMapItem['tracks/0/type'],
    tracks_path: props.subAnimationResourceMapItem['tracks/0/path'],
    tracks_interp: props.subAnimationResourceMapItem['tracks/0/interp'],
    tracks_loop_wrap: props.subAnimationResourceMapItem['tracks/0/loop_wrap'],
    tracks_imported: props.subAnimationResourceMapItem['tracks/0/imported'],
    tracks_enabled: props.subAnimationResourceMapItem['tracks/0/enabled'],
    tracks_key: props.subAnimationResourceMapItem['tracks/0/keys'],
    sprite_frame_coords,
  };
};

export const getBoxSelection = (line: string): IBoxSelection | undefined => {
  if (line == null || line.length < 1) return;
  const searchWord = 'Rect2(';
  const indexOfResource = line.indexOf(searchWord);
  if (indexOfResource < 0) return;

  const coordString = line.substring(indexOfResource + searchWord.length, line.length);
  const regex = /(\s\d+)\,(\s\d+)\,(\s\d+)\,(\s\d+)/;
  const matches = regex.exec(coordString);
  if ((matches?.length ?? 0) != 5) return;

  return {
    x: tryParseInt(matches![1])!,
    y: tryParseInt(matches![2])!,
    width: tryParseInt(matches![3])!,
    height: tryParseInt(matches![4])!,
  };
};

export const getBoxSelections = (line: string): Array<IBoxSelection> =>
  line
    .split('), ')
    .map(getBoxSelection)
    .filter((bs) => bs != null);
