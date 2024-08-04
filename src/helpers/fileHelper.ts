import { astroPaths } from 'constants/astro';
import fs from 'fs';
import path from 'path';

interface IProps {
  srcFile: string;
  destFilePath: string;
  overwrite: boolean;
}
export const copyFileIfNotExists = (props: IProps) => {
  createFoldersOfDestFilePath(props.destFilePath);
  const destExists = fs.existsSync(props.destFilePath);
  if (destExists) {
    if (props.overwrite) {
      fs.unlinkSync(props.destFilePath);
    } else {
      return;
    }
  }
  fs.copyFileSync(props.srcFile, props.destFilePath);
};

export const scaffoldFolderAndDelFileIfOverwrite = (
  outputFullPath: string,
  overwrite: boolean,
): boolean => {
  createFoldersOfDestFilePath(outputFullPath);
  const destExists = fs.existsSync(outputFullPath);
  if (destExists) {
    if (overwrite) {
      fs.unlinkSync(outputFullPath);
    } else {
      return destExists;
    }
  }
  return false;
};

export const getIndexOfFolderSlash = (destFilePath: string) => {
  const lastIndexOfSlash = Math.max(
    destFilePath.lastIndexOf('\\'), //
    destFilePath.lastIndexOf('/'),
  );
  return lastIndexOfSlash;
};

export const createFoldersOfDestFilePath = (destFilePath: string) => {
  const lastIndexOfSlash = getIndexOfFolderSlash(destFilePath);
  const destFolder = destFilePath.substring(0, lastIndexOfSlash);
  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
  }
};

export const getFolderFromFilePath = (filePath: string) => {
  const lastIndexOfSlash = getIndexOfFolderSlash(filePath);
  return filePath.substring(0, lastIndexOfSlash);
};

export const getFileFromFilePath = (filePath: string) => {
  const lastIndexOfSlash = getIndexOfFolderSlash(filePath);
  return filePath.substring(lastIndexOfSlash + 1);
};

export const deleteFileIfExists = (destFilePath: string) => {
  if (fs.existsSync(destFilePath)) {
    fs.unlinkSync(destFilePath);
  }
};

export const getBase64FromFile = (file: string, base64DataType: string = 'image/png'): string => {
  const contents = fs.readFileSync(file, 'base64');
  return `data:${base64DataType};base64,${contents}`;
};

export const getAnimFileName = (imgUrl: string, index: number) => {
  return imgUrl.replace('.png', `.anim${index + 1}.webp`);
};

export const removeLastFolder = (filepath: string) => {
  const indexOfLastSlash = filepath.lastIndexOf('\\');
  const fileName = filepath.substring(indexOfLastSlash, filepath.length);
  const destFolder = filepath.substring(0, indexOfLastSlash);
  const indexOfSecondLastSlash = destFolder.lastIndexOf('\\');
  return path.join(filepath.substring(0, indexOfSecondLastSlash), fileName);
};

interface IWriteProps<T> {
  botPath: string;
  destFileName: string;
  data: T;
}

export const writeDataToAssets = async <T>(props: IWriteProps<T>) => {
  const fullPath = path.join(props.botPath, 'assets', props.destFileName);
  await fs.writeFileSync(fullPath, JSON.stringify(props.data, null, 2), 'utf-8');
};

interface IReadProps {
  pathFolders: Array<string>;
  destFileName: string;
}
export const readDataFromAssets = async <T>(props: IReadProps): Promise<T> => {
  const fullPath = path.join(...astroPaths.assetsPath, ...props.pathFolders, props.destFileName);
  const content = await fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(content);
};
