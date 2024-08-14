import type { APIRoute } from 'astro';
import { astroPaths } from 'constants/astro';

import { IntermediateFile } from 'constants/intermediateFile';
import { availableLanguages, defaultLocale } from 'constants/localisation';
import type { IFusionEnhanced } from 'contracts/fusion';
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
  const itemMap = await readDataFromAssets<Record<string, IFusionEnhanced>>({
    pathFolders: [...astroPaths.intermediatePath, params.locale ?? defaultLocale],
    destFileName: IntermediateFile.fusion,
  });

  return new Response(JSON.stringify(itemMap), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
