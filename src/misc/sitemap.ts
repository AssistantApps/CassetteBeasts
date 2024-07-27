import fs from 'fs/promises';
import path from 'path';

import { handlebarTemplate } from 'constant/handlebar';
import { paths } from 'constant/paths';
import { site } from 'constant/site';
import { getHandlebar } from 'services/internal/handlebarService';

export const generateSiteMap = async () => {
  try {
    const htmlFiles = await getHtmlFilesInFolder(paths().destinationFolder);

    const sitePaths: Array<string> = [];
    for (const file of htmlFiles) {
      sitePaths.push(
        file.replace(paths().destinationFolder, '').replaceAll('\\', '/').substring(1),
      );
    }

    const destFullFilePath = path.join(paths().destinationFolder, 'sitemap.xml');
    const content = getHandlebar().getCompiledTemplate(handlebarTemplate.sitemap, {
      ...site,
      sitePaths,
    });
    fs.writeFile(destFullFilePath, content, 'utf8');
  } catch (e) {
    console.error(`Failed to generate sitemap.xml`, e);
  }
};

const getHtmlFilesInFolder = async (folder: string): Promise<Array<string>> => {
  const result: Array<string> = [];
  const list = await fs.readdir(folder, { withFileTypes: true });
  for (const dirent of list) {
    const fullPath = path.join(folder, dirent.name);
    if (dirent.isFile()) {
      if (dirent.name.endsWith('.html') == false) continue;
      result.push(fullPath);
      continue;
    }

    const subFiles = await getHtmlFilesInFolder(fullPath);
    for (const subFile of subFiles) {
      result.push(subFile);
    }
  }

  return result;
};
