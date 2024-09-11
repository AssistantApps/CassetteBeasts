import path from 'path';
import sharp from 'sharp';

import { AppImage } from 'constants/image';
import { paths } from 'constants/paths';
import { site } from 'constants/site';
import { getExternalResourcesImagePath } from 'contracts/mapper/externalResourceMapper';
import { getBase64FromFile } from 'helpers/fileHelper';

interface IMonsterFormMetaImageProps {
  spriteBase64: string;
  elementBase64: string;
  backgroundBase64: string;
  backgroundOverlayBase64: string;
  stickerWidth: number;
  stickerHeight: number;
  stickerY: number;
}
export const getMonsterFormMetaImage = async (
  stickerFilePath?: string,
  elementFilePath?: string,
): Promise<IMonsterFormMetaImageProps | undefined> => {
  if (stickerFilePath == null) return;
  const stickerPath = getExternalResourcesImagePath(stickerFilePath);
  if (stickerPath == null || stickerPath.length < 1) return;
  const spriteFullPath = path.join(paths().generatedImagesFolder, stickerPath);
  const spriteBase64 = getBase64FromFile(spriteFullPath);

  const elementPath = getExternalResourcesImagePath(elementFilePath);
  if (elementPath == null || elementPath.length < 1) return;
  const elementFullPath = path.join(paths().generatedImagesFolder, elementPath);
  const elementBase64 = getBase64FromFile(elementFullPath);

  const backgroundBase64 = getBase64FromFile(
    path.join(paths().destinationFolder, AppImage.metaTapeBg),
  );

  const backgroundOverlayBase64 = getBase64FromFile(
    path.join(paths().destinationFolder, AppImage.metaTapeOverlay),
  );

  const metaStickerHeight = (site.images.meta.height / 5) * 3;
  const metaData = await sharp(spriteFullPath).metadata();
  if (metaData.height == null || metaData.width == null) return;
  const metaStickerHeightRatio = metaStickerHeight / metaData.height;
  const metaStickerWidth = Math.round(metaData.width * metaStickerHeightRatio);
  const metaStickerY = site.images.meta.height - metaStickerHeight - 2;

  return {
    spriteBase64,
    elementBase64,
    backgroundBase64,
    backgroundOverlayBase64,
    stickerWidth: metaStickerWidth,
    stickerHeight: metaStickerHeight,
    stickerY: metaStickerY,
  };
};

interface IMonsterFormListMetaImageProps {
  monster0Base64?: string;
  monster1Base64?: string;
  monster2Base64?: string;
  element0Base64?: string;
  element1Base64?: string;
  element2Base64?: string;
  backgroundBase64: string;
}
export const getMonsterFormListMetaImage = async (
  monsters: Array<string | undefined>,
  elements: Array<string | undefined>,
): Promise<IMonsterFormListMetaImageProps | undefined> => {
  const monstersBase64: Array<string> = [];
  for (const monsterUrl of monsters) {
    const monsterPath = getExternalResourcesImagePath(monsterUrl);
    if (monsterPath == null || monsterPath.length < 1) return;
    const spriteFullPath = path.join(paths().generatedImagesFolder, monsterPath);
    const spriteBase64 = getBase64FromFile(spriteFullPath);
    monstersBase64.push(spriteBase64);
  }

  const elementsBase64: Array<string> = [];
  for (const elementUrl of elements) {
    const elementPath = getExternalResourcesImagePath(elementUrl);
    if (elementPath == null || elementPath.length < 1) return;
    const elementSpriteFullPath = path.join(paths().generatedImagesFolder, elementPath);
    const elementSpriteBase64 = getBase64FromFile(elementSpriteFullPath);
    elementsBase64.push(elementSpriteBase64);
  }

  const backgroundBase64 = getBase64FromFile(
    path.join(paths().destinationFolder, AppImage.characterBg),
  );

  return {
    monster0Base64: monstersBase64[0],
    monster1Base64: monstersBase64[1],
    monster2Base64: monstersBase64[2],
    element0Base64: elementsBase64[0],
    element1Base64: elementsBase64[1],
    element2Base64: elementsBase64[2],
    backgroundBase64,
  };
};
