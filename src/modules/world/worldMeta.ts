import path from 'path';
import sharp from 'sharp';

import { AppImage } from 'constants/image';
import { paths } from 'constants/paths';
import { site } from 'constants/site';
import { getBase64FromFile } from 'helpers/fileHelper';
import { getEstimatedCharWidth } from 'helpers/stringHelper';

interface IChunkMetaImagesProps {
  chunkGrid: Array<Array<string>>;
  nameOffset: number;
  backgroundBase64: string;
}
export const getChunkMetaImage = async (
  langCode: string,
  world: string,
  worldFolder: string,
  name_localised: string,
  chunkGrid: Array<Array<string | undefined>>,
): Promise<IChunkMetaImagesProps | undefined> => {
  let estimatedCharWidth = getEstimatedCharWidth(langCode);
  let nameOffset = site.images.meta.width - name_localised.length * estimatedCharWidth;
  if (nameOffset > 900) {
    nameOffset = 900;
  }
  if (nameOffset < 200) {
    nameOffset = 200;
  }

  const listGrid: Array<Array<string>> = [];
  for (const chunkRow of chunkGrid) {
    const listGridRow: Array<string> = [];
    for (const chunkId of chunkRow) {
      let spriteFullPath = '';
      if (chunkId != null) {
        spriteFullPath = path.join(
          paths().generatedImagesFolder,
          'data',
          'map_metadata',
          worldFolder,
          `${world}${chunkId}.png`,
        );
      } else {
        spriteFullPath = path.join(paths().imagesRootFolder, 'overworld_bg.png');
      }
      const chunkBuffer = await sharp(spriteFullPath)
        .resize({
          width: 512,
          height: 512,
          kernel: 'nearest',
        })
        .png()
        .toBuffer();
      listGridRow.push(`data:image/png;base64,${chunkBuffer.toString('base64')}`);
    }
    listGrid.push(listGridRow);
  }

  const backgroundBase64 = getBase64FromFile(
    path.join(paths().destinationFolder, AppImage.characterBg),
  );

  return {
    chunkGrid: listGrid,
    nameOffset,
    backgroundBase64,
  };
};

interface IWorldListMetaImagesProps {
  backgroundBase64: string;
}
export const getWorldListMetaImage = async (): Promise<IWorldListMetaImagesProps | undefined> => {
  const backgroundBase64 = getBase64FromFile(
    path.join(paths().destinationFolder, AppImage.overworldBg),
  );

  return {
    backgroundBase64,
  };
};
