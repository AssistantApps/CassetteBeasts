import { IExternalResource } from 'contracts/externalResource';

export const externalResourceMapper = (line: string): IExternalResource | undefined => {
  const regex = /\spath=\"(.+?)\"\stype=\"(.+?)\"\sid=(\d+)/;
  const matches = regex.exec(line);
  if ((matches?.length ?? 0) != 4) return;

  return {
    id: parseInt(matches[3]),
    path: matches[1],
    type: matches[2],
  };
};

export const getExternalResource = (
  line: string,
  externalResourcesMap: Record<number, IExternalResource>,
): IExternalResource => {
  if (line == null || line.length < 1) return;
  const searchWord = 'ExtResource(';
  const indexOfResource = line.indexOf(searchWord);
  if (indexOfResource < 0) return;

  const indexOfLastBracket = line.lastIndexOf(')');
  const idString = line.substring(indexOfResource + searchWord.length, indexOfLastBracket);
  const id = parseInt(idString);
  return externalResourcesMap[id];
};

export const getExternalResources = (
  line: string,
  externalResourcesMap: Record<number, IExternalResource>,
): Array<IExternalResource> =>
  (line ?? '')
    .split(', ')
    .map((subLine) => getExternalResource(subLine, externalResourcesMap))
    .filter((er) => er != null);

export const getExternalResourcesImagePath = (path?: string): string => {
  return (path ?? '').replace('res://', '');
};
