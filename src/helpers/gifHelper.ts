import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import GIFEncoder from 'gif-encoder-2';
import path from 'path';

import { ISpriteAnimDetailsEnhanced } from 'contracts/spriteAnim';
import { getExternalResourcesImagePath } from 'mapper/externalResourceMapper';
import { getBotPath, getConfig } from 'services/internal/configService';
import sharp from 'sharp';
import {
  createFoldersOfDestFilePath,
  getFileFromFilePath,
  getFolderFromFilePath,
} from './fileHelper';

interface IProps {
  overwrite: boolean;
  spriteFilePath: string;
  spriteSheetFilePath: string;
  animations: Array<ISpriteAnimDetailsEnhanced>;
}

export const createGifsFromISpriteAnim = async (props: IProps) => {
  const sprite = getExternalResourcesImagePath(props.spriteFilePath);
  if (sprite == null || sprite.length < 1) return;
  const spriteSheet = getExternalResourcesImagePath(props.spriteSheetFilePath);
  if (spriteSheet == null || spriteSheet.length < 1) return;

  const filePath = path.join(getConfig().getUnpackedDir(), 'res', sprite);
  const generatedFolder = path.join(getBotPath(), 'public', 'assets', 'img', 'generated');
  const destSprite = path.join(generatedFolder, sprite);
  const destFolder = getFolderFromFilePath(destSprite);

  createFoldersOfDestFilePath(destSprite);

  const firstFrame = props.animations[0].frames[0];
  const { width, height } = firstFrame;
  for (const animation of props.animations) {
    const destFileName = getFileFromFilePath(animation.imageUrl);
    const outputFile = path.join(destFolder, destFileName);
    if (fs.existsSync(outputFile)) {
      if (props.overwrite) {
        fs.unlinkSync(outputFile);
      } else {
        continue;
      }
    }

    const writeStream = fs.createWriteStream(outputFile);
    const encoder = new GIFEncoder(width, height);
    encoder.createReadStream().pipe(writeStream);
    encoder.start();
    encoder.setRepeat(0);
    encoder.setQuality(10);
    encoder.setTransparent('0xf3edd8');
    encoder.setDelay((animation.length * 1000) / animation.frames.length);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    if (!fs.existsSync(filePath)) {
      process.stdout.write('❌');
      continue;
    }

    try {
      for (const frame of animation.frames) {
        ctx.clearRect(0, 0, width, height);
        // ctx.fillStyle = '#f3edd8';
        // ctx.fillRect(0, 0, width, height);
        const buffer = await sharp(filePath)
          .extract({
            left: frame.x,
            top: frame.y,
            width: frame.width,
            height: frame.height,
          })
          .png()
          .toBuffer();
        const image = await loadImage(buffer);
        ctx.drawImage(image, 0, 0, width, height);
        encoder.addFrame(ctx);
      }
      encoder.finish();
      process.stdout.write('✔');
    } catch (ex) {
      console.error(ex);
    }
  }
};
