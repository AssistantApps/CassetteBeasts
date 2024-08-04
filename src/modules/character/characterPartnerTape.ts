import path from 'path';
import sharp from 'sharp';

import { AppImage } from 'constants/image';
import { paths } from 'constants/paths';
import { getExternalResourcesImagePath } from 'contracts/mapper/externalResourceMapper';
import { getBase64FromFile } from 'helpers/fileHelper';

interface IMetaImagesProps {
  spriteBase64: string;
  elementBase64: string;
  backgroundBase64: string;
  backgroundOverlayBase64: string;
  stickerWidth: number;
  stickerHeight: number;
  stickerY: number;
}
export const getCharacterPartnerTapeImage = async (
  stickerFilePath: string,
  elementFilePath: string,
  isBootleg: boolean = false,
): Promise<IMetaImagesProps | undefined> => {
  const stickerPath = getExternalResourcesImagePath(stickerFilePath);
  if (stickerPath == null || stickerPath.length < 1) return;
  const spriteFullPath = path.join(paths().generatedImagesFolder, stickerPath);
  const spriteBase64 = getBase64FromFile(spriteFullPath);

  const elementPath = getExternalResourcesImagePath(elementFilePath);
  if (elementPath == null || elementPath.length < 1) return;
  const elementFullPath = path.join(paths().generatedImagesFolder, elementPath);
  const elementBase64 = getBase64FromFile(elementFullPath);

  const tapeBg = isBootleg ? AppImage.tapeBootlegBg : AppImage.tapeBg;
  const backgroundBase64 = getBase64FromFile(path.join(paths().destinationFolder, tapeBg));

  const backgroundOverlayBase64 = getBase64FromFile(
    path.join(paths().destinationFolder, AppImage.tapeOverlay),
  );

  const metaStickerHeight = (256 / 5) * 2.5;
  const metaData = await sharp(spriteFullPath).metadata();
  if (metaData.height == null || metaData.width == null) return;
  const metaStickerHeightRatio = metaStickerHeight / metaData.height;
  const metaStickerWidth = Math.round(metaData.width * metaStickerHeightRatio);
  const metaStickerY = 256 - metaStickerHeight - 2;

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
