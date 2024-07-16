import { IExternalResource } from 'contracts/externalResource';
import { ISubResource } from 'contracts/subResource';
import { getExternalResource } from './externalResourceMapper';
import { getSubResource } from './subResourceMapper';

export const getResources = (
  line: string,
  externalResourcesMap: Record<number, IExternalResource>,
  subResourcesMap: Record<number, ISubResource>,
): Array<IExternalResource | ISubResource> =>
  line
    .split(', ')
    .map((subLine) => {
      if (line == null || line.length < 1) return [];
      const externalResource = getExternalResource(subLine, externalResourcesMap);
      const subResource = getSubResource(subLine, subResourcesMap);
      return [externalResource, subResource];
    })
    .flat(2)
    .filter((line) => line != null);
