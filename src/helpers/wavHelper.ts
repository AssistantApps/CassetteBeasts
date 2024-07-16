import fs from 'fs';
import path from 'path';

import { getExternalResourcesImagePath } from 'mapper/externalResourceMapper';
import { getConfig } from 'services/internal/configService';

export const copyWavFile = (sfxPath: string, outputPath: string) => {
  const wavPath = getExternalResourcesImagePath(sfxPath);
  if (wavPath == null || wavPath.length < 1) return;

  try {
    const filePath = path.join(getConfig().getUnpackedDir(), 'res', wavPath);
    fs.copyFileSync(filePath, outputPath);

    process.stdout.write('✔');
  } catch (ex) {
    console.error(ex);
  }
};
