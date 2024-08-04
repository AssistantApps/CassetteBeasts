import path from 'path';

import { paths } from 'constants/paths';
import { getExternalResourcesImagePath } from 'contracts/mapper/externalResourceMapper';
import { getBase64FromFile } from 'helpers/fileHelper';
import { getDescripLines } from 'helpers/stringHelper';

interface IMetaImagesProps {
  iconBase64: string;
  descriptionLines: Array<string>;
}
export const getStatusMetaImage = async (
  langCode: string,
  icon: string,
  description: string,
): Promise<IMetaImagesProps | undefined> => {
  const iconPath = getExternalResourcesImagePath(icon);
  if (iconPath == null || iconPath.length < 1) return;
  const iconFullPath = path.join(paths().generatedImagesFolder, iconPath);
  const iconBase64 = getBase64FromFile(iconFullPath);
  const descriptionLines = getDescripLines(langCode, description);

  return {
    iconBase64,
    descriptionLines,
  };
};
