import path from 'path';
import sharp from 'sharp';

import { AppImage } from 'constant/image';
import { paths } from 'constant/paths';
import { site } from 'constant/site';
import { getExternalResourcesImagePath } from 'mapper/externalResourceMapper';
import { getBase64FromFile } from 'helpers/fileHelper';
import { chineseLocale, japaneseLocale, koreanLocale } from 'constant/localisation';

interface IMetaImagesProps {
  portraitBase64: string;
  portraitWidth: number;
  nameOffset: number;
  backgroundBase64: string;
  personalTapeBase64: string;
  personalTapeWidth: number;
  personalTapeHeight: number;
  personalTapeX: number;
}
export const getCharacterMetaImage = async (
  langCode: string,
  name_localised: string,
  portraitFilePath: string,
  personalTapeFilePath: string,
): Promise<IMetaImagesProps> => {
  let estimatedCharWidth = 50;
  if (langCode == chineseLocale) estimatedCharWidth = 120;
  if (langCode == japaneseLocale) estimatedCharWidth = 120;
  if (langCode == koreanLocale) estimatedCharWidth = 120;

  const portraitPath = getExternalResourcesImagePath(portraitFilePath);
  if (portraitPath == null || portraitPath.length < 1) return;
  const portraitFullPath = path.join(paths().generatedImagesFolder, portraitPath);
  const portraitMetaData = await sharp(portraitFullPath).metadata();
  const portraitBase64 = getBase64FromFile(portraitFullPath);
  const portraitHeightRatio = site.images.meta.height / portraitMetaData.height;
  const portraitWidth = Math.round(portraitMetaData.width * portraitHeightRatio);
  const nameOffset = portraitWidth + name_localised.length * estimatedCharWidth;

  const personalTapePath = getExternalResourcesImagePath(personalTapeFilePath);
  if (personalTapePath == null || personalTapePath.length < 1) return;
  const personalTapeFullPath = path.join(paths().generatedImagesFolder, personalTapePath);
  const personalTapeBase64 = getBase64FromFile(personalTapeFullPath);

  const backgroundBase64 = getBase64FromFile(
    path.join(paths().destinationFolder, AppImage.characterBg),
  );

  const personalTapeHeight = (site.images.meta.height / 5) * 2.5;
  const personalTapeMetaData = await sharp(personalTapeFullPath).metadata();
  const personalTapeHeightRatio = personalTapeHeight / personalTapeMetaData.height;
  const personalTapeWidth = Math.round(personalTapeMetaData.width * personalTapeHeightRatio);
  const personalTapeX = portraitFilePath.includes('eugene') ? 650 : 800;

  return {
    portraitBase64,
    portraitWidth,
    nameOffset,
    personalTapeBase64,
    backgroundBase64,
    personalTapeWidth,
    personalTapeHeight,
    personalTapeX,
  };
};
