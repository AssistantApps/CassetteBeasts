import fs from 'fs/promises';
import sass from 'sass';

export const generateMainCss = () => {
  const cssContent = sass.compile('src/scss/main.scss');
  fs.writeFile('public/assets/css/main.css', cssContent.css);
  if (cssContent.sourceMap != null) {
    fs.writeFile('public/assets/css/main.css.map', JSON.stringify(cssContent.sourceMap));
  }
};
