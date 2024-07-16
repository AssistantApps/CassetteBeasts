import aliveServer from 'alive-server';
import fs from 'fs';
import watch from 'node-watch';
import path from 'path';
import sass from 'sass';

import { paths } from 'constant/paths';

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
      const cssContent = sass.compile('src/scss/main.scss');
      fs.writeFileSync('public/assets/css/main.css', cssContent.css);
      if (cssContent.sourceMap != null) {
        fs.writeFileSync('public/assets/css/main.css.map', JSON.stringify(cssContent.sourceMap));
      }
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
