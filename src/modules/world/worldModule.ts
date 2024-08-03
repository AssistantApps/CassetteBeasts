import fs from 'fs';

import { breadcrumb } from 'constant/breadcrumb';
import { handlebarTemplate } from 'constant/handlebar';
import { IntermediateFile } from 'constant/intermediateFile';
import { ModuleType } from 'constant/module';
import { routes } from 'constant/route';
import type { ILocalisation } from 'contracts/localisation';
import type { IMonsterFormEnhanced, IMonsterFormSimplified } from 'contracts/monsterForm';
import type { IMonsterSpawn } from 'contracts/monsterSpawn';
import type { IWorld, IWorldEnhanced, IWorldMetaDataEnhanced } from 'contracts/world';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { copyImageFromRes, copyImageToGeneratedFolder } from 'helpers/imageHelper';
import { pad } from 'helpers/stringHelper';
import { getExternalResourcesImagePath } from 'mapper/externalResourceMapper';
import { monsterToSimplified } from 'mapper/monsterMapper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { MonsterSpawnModule } from 'modules/monsterSpawn/monsterSpawnModule';
import { getHandlebar } from 'services/internal/handlebarService';
import { worldMapFromDetailList, worldMetaDataMapFromDetailList } from './worldMapFromDetailList';

export class WorldModule extends CommonModule<IWorld, IWorldEnhanced> {
  private _folders = [
    FolderPathHelper.world(), //
    FolderPathHelper.worldPier(),
  ];

  constructor() {
    super({
      type: ModuleType.World,
      intermediateFile: IntermediateFile.world,
      dependsOn: [
        ModuleType.Localisation, //
        ModuleType.MonsterSpawn,
        ModuleType.MonsterForms,
      ],
    });
  }

  init = async () => {
    if (this.isReady) return;

    const hiddenWorlds = ['deadworld'];
    for (const folder of this._folders) {
      const list = fs.readdirSync(folder);
      for (const file of list) {
        if (file.endsWith('.tres') == false) continue;
        const mapKey = file.replace('.tres', '');
        if (hiddenWorlds.includes(mapKey)) continue;

        const detail = await readItemDetail({
          fileName: file,
          folder: folder,
          mapFromDetailList: worldMapFromDetailList(mapKey),
        });

        if (detail.chunk_metadata_path?.length > 1) {
          const chunk_metadata_path = getExternalResourcesImagePath(detail.chunk_metadata_path);
          if (chunk_metadata_path != null && chunk_metadata_path.length > 1) {
            const chunkFolder = FolderPathHelper.worldMeta(chunk_metadata_path);
            const chunkFileList = fs.readdirSync(chunkFolder);
            for (const chunkFile of chunkFileList) {
              if (chunkFile.endsWith('.tres') == false) continue;
              const metaDataDetail = await readItemDetail({
                fileName: chunkFile,
                folder: chunkFolder,
                mapFromDetailList: worldMetaDataMapFromDetailList,
              });
              const mapChunkKey = chunkFile
                .replace(`${mapKey}_`, '')
                .replace('.tres', '')
                .replace('chunk_', '');
              detail.chunk_meta_data[mapChunkKey] = metaDataDetail;
            }
          }
        }

        this._baseDetails.push(detail);
      }
    }
    const map_chunk_metas = this._baseDetails.flatMap((map) =>
      Object.keys(map.chunk_meta_data),
    ).length;
    const count = pad(this._baseDetails.length, 3, ' ');
    return `${count} world files loaded with ${map_chunk_metas} chunks.`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(modules, ModuleType.Localisation);
    const language = localeModule.get(langCode).messages;
    const monsterSpawnModule = this.getModuleOfType<IMonsterSpawn>(
      modules,
      ModuleType.MonsterSpawn,
    ) as unknown as MonsterSpawnModule;
    const mapCoordToMonsterSpawnMap = monsterSpawnModule.getMapCoordToMonsterSpawnMap();
    const monsterFormModule = this.getModuleOfType<IMonsterFormEnhanced>(
      modules,
      ModuleType.MonsterForms,
    );

    for (const detail of this._baseDetails) {
      const mapKey = detail.id.toLowerCase();

      const allXValues: Array<number> = [];
      const allYValues: Array<number> = [];
      for (const chunkKey of Object.keys(detail.chunk_meta_data)) {
        const coord = chunkKey.split('_');
        allXValues.push(parseInt(coord[0]));
        allYValues.push(parseInt(coord[1]));
      }

      if (detail.chunk_layout == null) continue;

      const offsetX = Math.abs(detail.chunk_layout.x);
      const rangeX = detail.chunk_layout.w;
      const offsetY = Math.abs(detail.chunk_layout.y);
      const rangeY = detail.chunk_layout.h;

      const chunk_meta_data_localised: Array<Array<IWorldMetaDataEnhanced>> = Array.from(
        Array(rangeY),
      ).map((_) => Array.from(Array(rangeX)));
      for (const chunkKey of Object.keys(detail.chunk_meta_data)) {
        const chunk = detail.chunk_meta_data[chunkKey];
        const coords = chunkKey.split('_');
        const x = parseInt(coords[0]) + offsetX;
        const y = parseInt(coords[1]) + offsetY;

        const monster_in_habitat: Array<IMonsterFormSimplified> = [];
        const mapCoord = `${mapKey}_${coords[0]}_${coords[1]}`;
        const speciesInThisZone = mapCoordToMonsterSpawnMap[mapCoord];
        if (speciesInThisZone != null) {
          const monsterIds = speciesInThisZone.map((mon) => mon.monsterId);
          const distinctMonsterIds = monsterIds
            .filter((value, index, array) => array.indexOf(value) === index)
            .filter((m) => m != null);
          for (const monsterId of distinctMonsterIds) {
            const monster = monsterFormModule.get(monsterId);
            if (monster == null) continue;

            monster_in_habitat.push(
              monsterToSimplified(monster as unknown as IMonsterFormEnhanced),
            );
          }
        }

        chunk_meta_data_localised[y][x] = {
          ...chunk,
          id: chunkKey.replace('_', ' '),
          features: undefined,
          title_localised: language[chunk.title],
          features_localised: (chunk.features ?? [])
            .filter((feat) => feat != null)
            .map((feat) => ({
              ...feat,
              title_localised: language[feat.title ?? ''],
              icon_url: feat.icon?.path ?? '',
            })),
          monster_in_habitat: monster_in_habitat,
        };
      }

      const detailEnhanced: IWorldEnhanced = {
        ...detail,
        numOfColumns: rangeX,
        numOfRows: rangeY,
        title_localised: language[detail.title],
        chunk_meta_data: {},
        chunk_meta_data_localised: chunk_meta_data_localised,
        default_chunk_metadata_title_localised:
          language[detail.default_chunk_metadata?.title ?? ''],
        default_chunk_metadata: undefined,
      };

      this._itemDetailMap[mapKey] = detailEnhanced;
    }
    this.isReady = true;
  };

  getImagesFromGameFiles = async (overwrite: boolean) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IWorldEnhanced = this._itemDetailMap[mapKey];
      await copyImageFromRes(overwrite, detailEnhanced.map_texture);

      for (const row of detailEnhanced.chunk_meta_data_localised) {
        for (const col of row) {
          for (const feature of col?.features_localised ?? []) {
            if (feature.icon?.path == null) continue;
            await copyImageFromRes(overwrite, feature.icon);
          }
        }
      }
    }
  };

  generateImages = async (overwrite: boolean, modules: Array<CommonModule<unknown, unknown>>) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IWorldEnhanced = this._itemDetailMap[mapKey];
      await copyImageToGeneratedFolder(overwrite, detailEnhanced.map_texture);

      for (const row of detailEnhanced.chunk_meta_data_localised) {
        for (const col of row) {
          for (const feature of col?.features_localised ?? []) {
            if (feature.icon?.path == null) continue;
            await copyImageToGeneratedFolder(overwrite, feature.icon);
          }
        }
      }
    }
  };

  generateMetaImages = async (
    langCode: string,
    localeModule: LocalisationModule,
    overwrite: boolean,
  ) => {
    // for (const mapKey of Object.keys(this._itemDetailMap)) {
    //   const detailEnhanced: ICharacterEnhanced = this._itemDetailMap[mapKey];
    //   await this._generateCharacterMetaImage(langCode, overwrite, detailEnhanced);
    //   await this._generatePartnerMetaImage(langCode, overwrite, detailEnhanced);
    // }
  };

  writePages = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const mainBreadcrumb = breadcrumb.world(langCode);
    const relativePath = `${langCode}${routes.map}/index.html`;

    await getHandlebar().compileTemplateToFile({
      data: this.getBasicPageData({
        langCode,
        modules,
        documentTitleUiKey: mainBreadcrumb.uiKey,
        breadcrumbs: [mainBreadcrumb],
        data: { list: Object.values(this._itemDetailMap) },
        relativePath,
      }),
      outputFiles: [relativePath],
      templateFile: handlebarTemplate.worldTabs,
    });
  };
}
