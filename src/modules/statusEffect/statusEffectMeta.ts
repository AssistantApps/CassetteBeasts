import path from 'path';

import { AppImage } from 'constants/image';
import { paths } from 'constants/paths';
import { getExternalResourcesImagePath } from 'contracts/mapper/externalResourceMapper';
import { getBase64FromFile } from 'helpers/fileHelper';
import { getDescripLines } from 'helpers/stringHelper';
import { getBotPath } from 'services/internal/configService';

interface IStatusMetaImagesProps {
  iconBase64: string;
  descriptionLines: Array<string>;
}
export const getStatusMetaImage = async (
  langCode: string,
  icon: string,
  description: string,
): Promise<IStatusMetaImagesProps | undefined> => {
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

interface IStatusListMetaImagesProps {
  status0Base64?: string;
  status1Base64?: string;
  status2Base64?: string;
  status0Title?: string;
  status1Title?: string;
  status2Title?: string;
  backgroundBase64: string;
}
export const getStatusListMetaImage = async (
  names: Array<string | undefined>,
  list: Array<string | undefined>,
): Promise<IStatusListMetaImagesProps | undefined> => {
  const listBase64: Array<string> = [];
  for (const listItem of list) {
    const listItemPath = getExternalResourcesImagePath(listItem);
    let spriteFullPath = path.join(getBotPath(), 'public', 'assets', 'img', 'typeless.png');
    if (listItemPath != null && listItemPath.length > 0) {
      spriteFullPath = path.join(paths().generatedImagesFolder, listItemPath);
    }
    const spriteBase64 = getBase64FromFile(spriteFullPath);
    listBase64.push(spriteBase64);
  }

  const backgroundBase64 = getBase64FromFile(
    path.join(paths().destinationFolder, AppImage.characterBg),
  );

  return {
    status0Base64: listBase64[0],
    status1Base64: listBase64[1],
    status2Base64: listBase64[2],
    status0Title: names[0],
    status1Title: names[1],
    status2Title: names[2],
    backgroundBase64,
  };
};
