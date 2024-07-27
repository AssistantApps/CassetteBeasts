import path from 'path';
import sharp from 'sharp';

import { AppImage } from 'constant/image';
import { paths } from 'constant/paths';
import { site } from 'constant/site';
import { getBase64FromFile } from 'helpers/fileHelper';
import { getExternalResourcesImagePath } from 'mapper/externalResourceMapper';

interface IMetaImagesProps {
  spriteBase64: string;
  elementBase64: string;
  backgroundBase64: string;
  backgroundOverlayBase64: string;
  stickerWidth: number;
  stickerHeight: number;
  stickerY: number;
}
export const getMonsterFormMetaImage = async (
  stickerFilePath: string,
  elementFilePath: string,
): Promise<IMetaImagesProps> => {
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
