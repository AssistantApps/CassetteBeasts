import path from 'path';

import { AppImage } from 'constant/image';
import { UIKeys } from 'constant/localisation';
import { paths } from 'constant/paths';
import { ILocalisation } from 'contracts/localisation';
import { IMoveEnhanced } from 'contracts/move';
import { getBase64FromFile } from 'helpers/fileHelper';
import { getDescripLines } from 'helpers/stringHelper';
import { getExternalResourcesImagePath } from 'mapper/externalResourceMapper';

interface IMetaImagesProps {
  elementBase64: string;
  apFullBase64: string;
  apFullArray: Array<string>;
  apEmptyBase64: string;
  apEmptyArray: Array<string>;
  descriptionLines: Array<string>;
  additional: Array<string>;
}
export const getMoveMetaImage = async (
  langCode: string,
  elementFilePath: string,
  detail: IMoveEnhanced,
  language: Record<number, ILocalisation>,
): Promise<IMetaImagesProps> => {
  const elementPath = getExternalResourcesImagePath(elementFilePath);
  if (elementPath == null || elementPath.length < 1) return;
  const elementFullPath = path.join(paths().generatedImagesFolder, elementPath);
  const elementBase64 = getBase64FromFile(elementFullPath);

  const apFullBase64 = getBase64FromFile(path.join(paths().destinationFolder, AppImage.metaAp));
  const apEmptyBase64 = getBase64FromFile(path.join(paths().destinationFolder, AppImage.metaApx));

  const apFullArray: Array<string> = [];
  for (let index = 0; index < detail.cost; index++) {
    apFullArray.push('');
  }
  const apEmptyArray: Array<string> = [];
  for (let index = 0; index < 10; index++) {
    apEmptyArray.push('');
  }

  const descriptionLines = getDescripLines(langCode, detail.description_localised);

  const additional = [language[UIKeys.power].replace('{power}', detail.power)];
  if (detail.unavoidable) {
    additional.push(`${language[UIKeys.accuracy]}: Unavoidable`);
  } else {
    additional.push(`${language[UIKeys.accuracy]}: ${detail.accuracy}%`);
  }

  return {
    elementBase64,
    apFullBase64,
    apEmptyBase64,
    apFullArray,
    apEmptyArray,
    descriptionLines,
    additional,
  };
};
