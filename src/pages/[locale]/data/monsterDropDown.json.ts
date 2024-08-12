import type { APIRoute } from 'astro';
import { astroPaths } from 'constants/astro';

import { IntermediateFile } from 'constants/intermediateFile';
import { availableLanguages, defaultLocale } from 'constants/localisation';
import type { IMonsterFormEnhanced } from 'contracts/monsterForm';
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
  const itemMap = await readDataFromAssets<Record<string, IMonsterFormEnhanced>>({
    pathFolders: [...astroPaths.intermediatePath, params.locale ?? defaultLocale],
    destFileName: IntermediateFile.monsterForms,
  });
  const monsterDropdown = Object.values(itemMap).map((monster) => ({
    id: monster.id,
    name: monster.name_localised,
    icon: monster.icon_url,
    bestiary_index: monster.bestiary_index,
    prefix: monster.fusion_name_prefix_localised,
    suffix: monster.fusion_name_suffix_localised,
  }));

  return new Response(JSON.stringify(monsterDropdown), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
