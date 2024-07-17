import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { Resvg } from '@resvg/resvg-js';
import { fontMetas, IFontFile } from 'constant/fonts';
import { paths } from 'constant/paths';
import { IBoxSelection } from 'contracts/boxSelection';
import { IExternalResource } from 'contracts/externalResource';
import { getExternalResourcesImagePath } from 'mapper/externalResourceMapper';
import { getBotPath, getConfig } from 'services/internal/configService';
import { copyFileIfNotExists, createFoldersOfDestFilePath } from './fileHelper';
import { retryAsync } from './retryHelper';

interface ICutImageWhenCopying {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const copyImageFromRes = async (overwrite: boolean, externalResource: IExternalResource) => {
  const imagePath = getExternalResourcesImagePath(externalResource?.path);
  if (imagePath == null || imagePath.length < 1) return;

  try {
    const filePath = path.join(getConfig().getUnpackedDir(), 'res', imagePath);
    const destFilePath = path.join(paths().gameImagesFolder, imagePath);

    createFoldersOfDestFilePath(destFilePath);
    if (fs.existsSync(destFilePath)) {
      if (overwrite) {
        fs.unlinkSync(destFilePath);
      } else {
        return;
      }
    }
    await sharp(filePath).png().toFile(destFilePath);
    process.stdout.write('✔');
  } catch (ex) {
    console.error(ex);
  }
};

interface ICutImageFromSpriteSheetProps {
  overwrite: boolean;
  spriteFilePath: string;
  boxSelection: IBoxSelection;
}
export const cutImageFromSpriteSheet = async (props: ICutImageFromSpriteSheetProps) => {
  const sprite = getExternalResourcesImagePath(props.spriteFilePath);
  if (sprite == null || sprite.length < 1) return;

  await retryAsync({
    attempts: 3,
    func: async () => {
      const srcSpriteSheet = path.join(paths().gameImagesFolder, sprite);
      const destSprite = path.join(paths().generatedImagesFolder, sprite);

      if (fs.existsSync(destSprite)) {
        if (props.overwrite) {
          fs.unlinkSync(destSprite);
        } else {
          return;
        }
      }

      await sharp(srcSpriteSheet)
        .extract({
          left: props.boxSelection.x,
          top: props.boxSelection.y,
          width: props.boxSelection.width,
          height: props.boxSelection.height,
        })
        .toFile(destSprite);
      process.stdout.write('✔');
    },
    onError: (ex) => console.error(ex),
  });
};

export const copyImageToGeneratedFolder = async (
  overwrite: boolean,
  externalResource: IExternalResource,
  cutImageWhenCopying: ICutImageWhenCopying = null,
) => {
  const imagePath = getExternalResourcesImagePath(externalResource?.path);
  if (imagePath == null || imagePath.length < 1) return;

  try {
    const srcFilePath = path.join(paths().gameImagesFolder, imagePath);
    const destFilePath = path.join(paths().generatedImagesFolder, imagePath);

    createFoldersOfDestFilePath(destFilePath);
    if (fs.existsSync(destFilePath)) {
      if (overwrite) {
        fs.unlinkSync(destFilePath);
      } else {
        return;
      }
    }
    let imageTask = sharp(srcFilePath);
    if (cutImageWhenCopying != null) {
      imageTask = imageTask.extract(cutImageWhenCopying);
    }
    await imageTask.png().toFile(destFilePath);
    process.stdout.write('✔');
  } catch (ex) {
    console.error(ex);
  }
};

export const writePngFromSvg = (
  compiledTemplate: string,
  fonts: Array<IFontFile> = fontMetas.default,
) => {
  const fontFiles = fonts.map((fontMeta) => path.join(paths().destinationFolder, fontMeta.file));
  const opts = {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
    font: undefined,
  };
  if (fonts.length > 0) {
    opts.font = {
      fontFiles: fontFiles,
      defaultFontFamily: fonts[0].name,
      sansSerifFamily: fonts[0].name,
      loadSystemFonts: false, // It will be faster to disable loading system fonts.
    };
  }
  const resvg = new Resvg(compiledTemplate, opts as any);
  const pngData = resvg.render();
  const buffer = pngData.asPng();
  return buffer;
};

export const getBase64FromTemplate = (
  template: string,
  base64DataType: string = 'image/png',
): string => {
  const pngBuffer = writePngFromSvg(template);
  return `data:${base64DataType};base64,${pngBuffer.toString('base64')}`;
};

interface IGenerateMetaImageProps {
  overwrite: boolean;
  template: string;
  langCode: string;
  outputFullPath: string;
}
export const generateMetaImage = (props: IGenerateMetaImageProps) => {
  let fonts = fontMetas[props.langCode];
  if (fonts == null) fonts = fontMetas.default;

  try {
    const pngBuffer = writePngFromSvg(props.template, fonts);
    createFoldersOfDestFilePath(props.outputFullPath);
    fs.writeFileSync(props.outputFullPath, pngBuffer);
    process.stdout.write('✔');
  } catch (ex) {
    console.error(ex);
  }
};
