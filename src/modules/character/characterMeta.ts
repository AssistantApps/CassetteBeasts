import path from 'path';
import sharp from 'sharp';

import { AppImage } from 'constants/image';
import { paths } from 'constants/paths';
import { site } from 'constants/site';
import { getExternalResourcesImagePath } from 'contracts/mapper/externalResourceMapper';
import { getBase64FromFile } from 'helpers/fileHelper';
import { getEstimatedCharWidth } from 'helpers/stringHelper';

interface ICharacterMetaImagesProps {
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
): Promise<ICharacterMetaImagesProps | undefined> => {
  let estimatedCharWidth = getEstimatedCharWidth(langCode);

  const portraitPath = getExternalResourcesImagePath(portraitFilePath);
  if (portraitPath == null || portraitPath.length < 1) return;
  const portraitFullPath = path.join(paths().generatedImagesFolder, portraitPath);
  const portraitMetaData = await sharp(portraitFullPath).metadata();
  const portraitBase64 = getBase64FromFile(portraitFullPath);

  if (portraitMetaData.height == null || portraitMetaData.width == null) return;
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
  if (personalTapeMetaData.height == null || personalTapeMetaData.width == null) return;

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

interface ICharacterListMetaImagesProps {
  character0Base64?: string;
  character1Base64?: string;
  character2Base64?: string;
  element0Base64?: string;
  element1Base64?: string;
  element2Base64?: string;
  backgroundBase64: string;
}
export const getCharacterListMetaImage = async (
  characters: Array<string | undefined>,
): Promise<ICharacterListMetaImagesProps | undefined> => {
  const charactersBase64: Array<string> = [];
  for (const characterUrl of characters) {
    const characterPath = getExternalResourcesImagePath(characterUrl);
    if (characterPath == null || characterPath.length < 1) return;
    const spriteFullPath = path.join(paths().generatedImagesFolder, characterPath);
    const spriteBase64 = getBase64FromFile(spriteFullPath);
    charactersBase64.push(spriteBase64);
  }

  const backgroundBase64 = getBase64FromFile(
    path.join(paths().destinationFolder, AppImage.characterBg),
  );

  return {
    character0Base64: charactersBase64[0],
    character1Base64: charactersBase64[1],
    character2Base64: charactersBase64[2],
    backgroundBase64,
  };
};
