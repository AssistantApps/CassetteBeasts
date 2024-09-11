import fs from 'fs';
import path from 'path';

import { handlebarTemplate } from 'constants/handlebar';
import { IntermediateFile } from 'constants/intermediateFile';
import { UIKeys } from 'constants/localisation';
import { ModuleType } from 'constants/module';
import { paths } from 'constants/paths';
import { routes } from 'constants/route';
import { site } from 'constants/site';
import type { ILocalisation } from 'contracts/localisation';
import { getExternalResourcesImagePath } from 'contracts/mapper/externalResourceMapper';
import { monsterToSimplified } from 'contracts/mapper/monsterMapper';
import type { IMonsterFormEnhanced, IMonsterFormSimplified } from 'contracts/monsterForm';
import type { IMonsterSpawn } from 'contracts/monsterSpawn';
import type { IWorld, IWorldEnhanced, IWorldMetaDataEnhanced } from 'contracts/world';
import { scaffoldFolderAndDelFileIfOverwrite } from 'helpers/fileHelper';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import {
  copyImageFromRes,
  copyImageToGeneratedFolder,
  cutImageFromSpriteSheet,
  generateMetaImage,
  getImageMeta,
} from 'helpers/imageHelper';
import { pad } from 'helpers/stringHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { MonsterSpawnModule } from 'modules/monsterSpawn/monsterSpawnModule';
import { getHandlebar } from 'services/internal/handlebarService';
import { worldMapFromDetailList, worldMetaDataMapFromDetailList } from './worldMapFromDetailList';
import { getChunkMetaImage, getWorldListMetaImage } from './worldMeta';

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
    const localeModule = this.getModuleOfType<ILocalisation>(
      modules,
      ModuleType.Localisation,
    ) as LocalisationModule;
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
      let worldFolder = '';
      if (mapKey == 'pier_map_metadata') worldFolder = 'pier/';

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

        const chunkId = chunkKey.replace('_', ' ');
        chunk_meta_data_localised[y][x] = {
          ...chunk,
          id: chunkId,
          features: undefined,
          title_localised: localeModule.translate(langCode, chunk.title),
          features_localised: (chunk.features ?? [])
            .filter((feat) => feat != null)
            .map((feat) => ({
              ...feat,
              title_localised: localeModule.translate(langCode, feat.title ?? ''),
              icon_url: feat.icon?.path ?? '',
            })),
          monster_in_habitat: monster_in_habitat,
          species_in_this_zone: speciesInThisZone ?? [],
          meta_image_url: `/assets/img/meta/${langCode}${routes.map}/${worldFolder}${encodeURI(chunkId)}.png`,
        };
      }

      const detailEnhanced: IWorldEnhanced = {
        ...detail,
        numOfColumns: rangeX,
        numOfRows: rangeY,
        title_localised: localeModule.translate(langCode, detail.title),
        chunk_meta_data: {},
        chunk_meta_data_localised: chunk_meta_data_localised,
        default_chunk_metadata_title_localised: localeModule.translate(
          langCode,
          detail.default_chunk_metadata?.title ?? '',
        ),
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
      const metaData = await getImageMeta(
        paths().gameImagesFolder,
        detailEnhanced.map_texture?.path,
      );
      if (metaData == null) continue;

      const offsetX = Math.abs(detailEnhanced.chunk_layout?.x ?? 0);
      const offsetY = Math.abs(detailEnhanced.chunk_layout?.y ?? 0);
      const cellWidth = Math.round(metaData.width / detailEnhanced.numOfColumns);
      const cellHeight = Math.round(metaData.height / detailEnhanced.numOfRows);

      for (const row of detailEnhanced.chunk_meta_data_localised) {
        for (const col of row) {
          if (col?.id != null) {
            const coords = col.id.split(' ');
            await cutImageFromSpriteSheet({
              overwrite,
              boxSelection: {
                x: (parseInt(coords[0]) + offsetX) * cellWidth,
                y: (parseInt(coords[1]) + offsetY) * cellHeight,
                width: cellWidth,
                height: cellHeight,
              },
              spriteFilePath: detailEnhanced.map_texture?.path,
              destFileName: `${mapKey}${col.id}.png`,
            });
          }
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
    modules: Array<CommonModule<unknown, unknown>>,
    overwrite: boolean,
  ) => {
    await this._getMapListMetaImage(langCode, overwrite, localeModule);

    for (const worldKey of Object.keys(this._itemDetailMap)) {
      let worldFolder = '';
      if (worldKey == 'pier_map_metadata') worldFolder = 'pier';

      const chunksGrid = this._itemDetailMap[worldKey].chunk_meta_data_localised;
      const flatChunks = chunksGrid.flat();
      for (let rowIndex = 0; rowIndex < chunksGrid.length; rowIndex++) {
        const chunkRow = chunksGrid[rowIndex];
        for (let colIndex = 0; colIndex < chunkRow.length; colIndex++) {
          const chunk = chunkRow[colIndex];
          if (chunk?.id == null) continue;
          const coords = chunk.id.split(' ');

          const outputFullPath = path.join(
            paths().destinationFolder,
            decodeURI(chunk.meta_image_url),
          );
          const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
          if (exists) continue;

          const surroundingChunks: Array<Array<string | undefined>> = [];
          for (let yIndex = 0; yIndex < 3; yIndex++) {
            const surroundingChunkRow: Array<string | undefined> = [];
            for (let xIndex = 0; xIndex < 3; xIndex++) {
              const yOffset = yIndex - 1;
              const xOffset = xIndex - 1;
              const targetId = `${parseInt(coords[0]) + xOffset} ${parseInt(coords[1]) + yOffset}`;
              const item = flatChunks.find((c) => c?.id == targetId);
              surroundingChunkRow.push(item?.id);
            }
            surroundingChunks.push(surroundingChunkRow);
          }

          const extraData = await getChunkMetaImage(
            langCode,
            worldKey,
            worldFolder,
            chunk.title_localised,
            surroundingChunks,
          );
          const template = getHandlebar().getCompiledTemplate<unknown>(
            handlebarTemplate.mapChunkMetaImage,
            { ...site, ...chunk, title: chunk.title_localised, ...extraData } as any,
          );

          generateMetaImage({ overwrite, template, langCode, outputFullPath });
        }
      }
    }
  };

  private _getMapListMetaImage = async (
    langCode: string,
    overwrite: boolean,
    localeModule: LocalisationModule,
  ) => {
    const outputFile = `/assets/img/meta/${langCode}${routes.map}-meta.png`;
    const outputFullPath = path.join(paths().destinationFolder, outputFile);
    const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
    if (exists) return;

    const extraData = await getWorldListMetaImage();
    const title = localeModule.translate(langCode, UIKeys.map);
    const template = getHandlebar().getCompiledTemplate<unknown>(
      handlebarTemplate.mapListMetaImage,
      { ...extraData, title },
    );

    generateMetaImage({ overwrite, template, langCode, outputFullPath });
  };
}
