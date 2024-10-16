import fs from 'fs';
import path from 'path';

import { paths } from 'constants/paths';
import { getExternalResourcesImagePath } from 'contracts/mapper/externalResourceMapper';
import type { ISpriteAnimDetailsEnhanced } from 'contracts/spriteAnim';
import { animateWebp, type IFrameInstructions } from 'lib/webpmux';
import { getBotPath } from 'services/internal/configService';
import sharp from 'sharp';
import {
  createFoldersOfDestFilePath,
  getFileFromFilePath,
  getFolderFromFilePath,
} from './fileHelper';
import { uuidv4 } from './guidHelper';
import { retryAsync } from './retryHelper';

interface IProps {
  overwrite: boolean;
  spriteFilePath: string;
  animations: Array<ISpriteAnimDetailsEnhanced>;
}

export const createWebpFromISpriteAnim = async (props: IProps) => {
  const sprite = getExternalResourcesImagePath(props.spriteFilePath);
  if (sprite == null || sprite.length < 1) return;

  const srcSpriteSheet = path.join(paths().gameImagesFolder, sprite);
  const generatedFolder = path.join(getBotPath(), 'public', 'assets', 'img', 'generated');
  const destSprite = path.join(generatedFolder, sprite);
  const destFolder = getFolderFromFilePath(destSprite);
  const tempImageFolder = paths().libFolder;

  createFoldersOfDestFilePath(destSprite);

  for (const animation of props.animations) {
    const destFileName = getFileFromFilePath(animation.imageUrl);
    const outputFilePath = path.join(destFolder, destFileName);
    if (fs.existsSync(outputFilePath)) {
      if (props.overwrite) {
        fs.unlinkSync(outputFilePath);
      } else {
        continue;
      }
    }

    if (!fs.existsSync(srcSpriteSheet)) {
      process.stdout.write('❌');
      continue;
    }

    const createdFilesFromRetry = await retryAsync({
      attempts: 3,
      func: async () => {
        const createdFiles: Array<string> = [];
        let frameDelay = (animation.length * 1000) / animation.frames.length;
        if (isNaN(frameDelay)) frameDelay = 100;
        const frameInstructions: Array<IFrameInstructions> = [];
        for (const frame of animation.frames) {
          const frameOutputFilePath = path.join(tempImageFolder, `${uuidv4()}.webp`);
          await sharp(srcSpriteSheet)
            .extract({
              left: frame.x,
              top: frame.y,
              width: frame.width,
              height: frame.height,
            })
            .webp({
              lossless: true,
            })
            .toFile(frameOutputFilePath);
          createdFiles.push(frameOutputFilePath);
          frameInstructions.push({
            path: frameOutputFilePath,
            opts: `+${frameDelay}+0+0+0-b`,
          });
        }

        await animateWebp({ frameInstructions, outputFilePath });
        process.stdout.write('✔');
        return createdFiles;
      },
      onError: (ex) => console.error(ex),
    });

    for (const createdFile of createdFilesFromRetry ?? []) {
      fs.unlinkSync(createdFile);
    }
  }
};
