import type { APIRoute } from 'astro';
import { astroPaths } from 'constants/astro';
import { IntermediateFile } from 'constants/intermediateFile';
import { availableLanguages, defaultLocale } from 'constants/localisation';

import type { ISpriteAnim } from 'contracts/spriteAnim';
import { readDataFromAssets } from 'helpers/fileHelper';

export async function getStaticPaths() {
  const paths: any = [];
  for (const locale of availableLanguages) {
    const path = {
      params: { locale: locale },
    };
    paths.push(path as never);
  }
  return paths;
}

export const GET: APIRoute = async ({ params }) => {
  const fusionSpriteMap = await readDataFromAssets<Record<string, ISpriteAnim>>({
    pathFolders: [...astroPaths.intermediatePath, params.locale ?? defaultLocale],
    destFileName: IntermediateFile.fusionSpriteAnim,
  });

  for (const fusionKey of Object.keys(fusionSpriteMap)) {
    const item = { ...fusionSpriteMap[fusionKey] };
    const firstFrame = item.animations[0].frames[0];
    fusionSpriteMap[fusionKey] = {
      ...item,
      animations: [
        {
          ...item.animations[0],
          frames: [firstFrame],
        },
      ],
    };
  }

  return new Response(JSON.stringify(fusionSpriteMap), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
