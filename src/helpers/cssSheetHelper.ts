import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { paths } from 'constants/paths';
import type { IBoxSelection } from 'contracts/boxSelection';
import { createFoldersOfDestFilePath } from './fileHelper';

interface ICreateSheetFromList {
  overwrite: boolean;
  destSpriteSheetName: string;
  files: Record<number, IImageFilePathWithDimensions | undefined>;
}

export const createSheetFromFileList = async (props: ICreateSheetFromList) => {
  let maxWidth: number = 0;
  let maxHeight: number = 0;
  const spriteSheetLookup: Record<number, IBoxSelection> = {};

  const destFilePath = path.join(paths().generatedImagesFolder, props.destSpriteSheetName);
  const destJsonPath = path
    .join(paths().intermediateFolder, props.destSpriteSheetName)
    .replace('.png', '.json');
  createFoldersOfDestFilePath(destFilePath);
  if (fs.existsSync(destFilePath)) {
    if (props.overwrite) {
      fs.unlinkSync(destFilePath);
    } else {
      return;
    }
  }

  for (const file of Object.values(props.files)) {
    if (file == null) continue;
    if (file.height > maxHeight) maxHeight = file.height;
    if (file.width > maxWidth) maxWidth = file.width;
  }

  const fileKeys = Object.keys(props.files);
  const sqrRoot = Math.sqrt(fileKeys.length);
  const numCol = Math.ceil(sqrRoot);
  const numRow = Math.ceil(fileKeys.length / numCol);
  const canvasWidth = numCol * maxWidth;
  const canvasHeight = numRow * maxHeight;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');
  for (const fileKey of fileKeys) {
    const file = props.files[+fileKey];
    if (file == null) continue;
    if (fs.existsSync(file.filePath) == false) continue;

    const idInt = parseInt(fileKey);
    const col = idInt % numCol;
    const row = Math.floor(idInt / numCol);

    try {
      const buffer = await sharp(file.filePath).png().toBuffer();
      const image = await loadImage(buffer);
      const x = col * maxWidth;
      const y = row * maxHeight;
      ctx.drawImage(image, x, y, file.width, file.height);
      spriteSheetLookup[idInt] = { x, y, width: file.width, height: file.height };
    } catch (e) {
      console.error(`Unable to create sprite sheet for ${props.destSpriteSheetName}`, e);
    }
  }

  try {
    const canvasBuffer = canvas.toBuffer();
    await sharp(canvasBuffer).toFile(destFilePath);
    fs.writeFileSync(destJsonPath, JSON.stringify(spriteSheetLookup, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Unable to create sprite sheet for ${props.destSpriteSheetName}`, e);
  }
};
