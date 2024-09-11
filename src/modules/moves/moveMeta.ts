import path from 'path';

import { AppImage } from 'constants/image';
import { UIKeys } from 'constants/localisation';
import { paths } from 'constants/paths';
import { getExternalResourcesImagePath } from 'contracts/mapper/externalResourceMapper';
import type { IMoveEnhanced } from 'contracts/move';
import { getBase64FromFile } from 'helpers/fileHelper';
import { getDescripLines } from 'helpers/stringHelper';
import type { LocalisationModule } from 'modules/localisation/localisationModule';
import { getBotPath } from 'services/internal/configService';

interface IMoveMetaImagesProps {
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
  localeModule: LocalisationModule,
): Promise<IMoveMetaImagesProps | undefined> => {
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

  const additional = [
    (localeModule.translate(langCode, UIKeys.power) ?? '').replace(
      '{power}',
      detail.power.toString(),
    ),
  ];
  if (detail.unavoidable) {
    additional.push(`${localeModule.translate(langCode, UIKeys.accuracy)}: Unavoidable`);
  } else {
    additional.push(`${localeModule.translate(langCode, UIKeys.accuracy)}: ${detail.accuracy}%`);
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

interface IMoveListMetaImagesProps {
  move0Base64?: string;
  move1Base64?: string;
  move2Base64?: string;
  move0Title?: string;
  move1Title?: string;
  move2Title?: string;
  backgroundBase64: string;
}
export const getMoveListMetaImage = async (
  names: Array<string | undefined>,
  list: Array<string | undefined>,
): Promise<IMoveListMetaImagesProps | undefined> => {
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
    move0Base64: listBase64[0],
    move1Base64: listBase64[1],
    move2Base64: listBase64[2],
    move0Title: names[0],
    move1Title: names[1],
    move2Title: names[2],
    backgroundBase64,
  };
};
