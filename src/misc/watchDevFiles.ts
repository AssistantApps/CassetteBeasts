import watch from 'node-watch';
import path from 'path';

import { paths } from 'constant/paths';
import { generateMainCss } from './sass';

const aliveServer = require('alive-server');

interface IWatchDevFiles {
  onSassChange?: () => void;
  onTemplateChange: (filePath: string) => void;
}
export const watchDevFiles = (props: IWatchDevFiles) => {
  const publicFolder = path.join(paths().destinationFolder);
  aliveServer.start({
    port: 8282,
    host: '0.0.0.0',
    wait: 1000,
    root: publicFolder,
  });

  watch(paths().scssFolder, { recursive: true }, () => {
    try {
      generateMainCss();
      props.onSassChange?.();
    } catch (ex) {
      console.error(ex);
    }
  });

  watch(paths().templatesFolder, { recursive: true }, (state: string, filePath: string) => {
    const file = filePath
      .replace(paths().templatesFolder, '')
      .substring(1)
      .replaceAll('\\', '/')
      .trim();
    props.onTemplateChange(file);
  });
};
