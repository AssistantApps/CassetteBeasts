import fs from 'fs/promises';
import sass from 'sass';

import { createFoldersOfDestFilePath } from 'helpers/fileHelper';

export const generateMainCss = () => {
  const cssContent = sass.compile('src/scss/main.scss');
  const destFile = 'public/assets/css/main.css';
  createFoldersOfDestFilePath(destFile);
  fs.writeFile(destFile, cssContent.css);
  if (cssContent.sourceMap != null) {
    fs.writeFile(destFile.replace('.css', '.css.map'), JSON.stringify(cssContent.sourceMap));
  }
};
