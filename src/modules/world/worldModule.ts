import fs from 'fs';

import { IntermediateFile } from 'constant/intermediateFile';
import { ModuleType } from 'constant/module';
import { ILocalisation } from 'contracts/localisation';
import { IWorld, IWorldEnhanced, IWorldMetaDataEnhanced } from 'contracts/world';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { copyImageFromRes, copyImageToGeneratedFolder } from 'helpers/imageHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { worldMapFromDetailList, worldMetaDataMapFromDetailList } from './worldMapFromDetailList';
import { getExternalResourcesImagePath } from 'mapper/externalResourceMapper';
import { tryParseInt } from 'helpers/mathHelper';
import { breadcrumb } from 'constant/breadcrumb';
import { handlebarTemplate } from 'constant/handlebar';
import { routes } from 'constant/route';
import { getHandlebar } from 'services/internal/handlebarService';
import { anyObject } from 'helpers/typescriptHacks';

export class WorldModule extends CommonModule<IWorld> {
  private _folders = [
    FolderPathHelper.world(), //
    FolderPathHelper.worldPier(),
  ];

  constructor() {
    super({
      type: ModuleType.World,
      intermediateFile: IntermediateFile.world,
      dependsOn: [ModuleType.Localisation],
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
    return `${this._baseDetails.length}  world files loaded with ${map_chunk_metas} chunks.`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(modules, ModuleType.Localisation);
    const language = localeModule.get(langCode).messages;

    for (const detail of this._baseDetails) {
      const mapKey = detail.id.toLowerCase();

      const allXValues: Array<number> = [];
      const allYValues: Array<number> = [];
      for (const chunkKey of Object.keys(detail.chunk_meta_data)) {
        const coord = chunkKey.split('_');
        allXValues.push(parseInt(coord[0]));
        allYValues.push(parseInt(coord[1]));
      }
      const minX = Math.min(...allXValues);
      const maxX = Math.max(...allXValues);
      const offsetX = 0 - minX;
      const rangeX = Math.abs(minX - maxX) + 1;
      const minY = Math.min(...allYValues);
      const maxY = Math.max(...allYValues);
      const offsetY = 0 - minX;
      const rangeY = Math.abs(minY - maxY) + 1;

      const chunk_meta_data_localised: Array<Array<IWorldMetaDataEnhanced>> = Array.from(
        Array(rangeY),
      ).map((_) => Array.from(Array(rangeX)));
      for (const chunkKey of Object.keys(detail.chunk_meta_data)) {
        const chunk = detail.chunk_meta_data[chunkKey];
        const coords = chunkKey.split('_');
        const x = parseInt(coords[0]) + offsetX;
        const y = parseInt(coords[1]) + offsetY;
        chunk_meta_data_localised[y][x] = {
          ...chunk,
          id: chunkKey,
          features: undefined,
          title_localised: language[chunk.title],
          features_localised: chunk.features
            .filter((feat) => feat != null)
            .map((feat) => ({
              ...feat,
              title_localised: language[feat.title],
              icon_url: feat.icon?.path,
            })),
        };
      }

      // const chunk_meta_data_localised_pivoted: Array<Array<IWorldMetaDataEnhanced>> = Array.from(
      //   Array(gridY),
      // ).map((_) => Array.from(Array(gridX)));
      // for (let x = 0; x < gridX; x++) {
      //   for (let y = 0; y < gridY; y++) {
      //     chunk_meta_data_localised_pivoted[y][x] = chunk_meta_data_localised[x][y];
      //   }
      // }

      const detailEnhanced: IWorldEnhanced = {
        ...detail,
        numOfColumns: rangeX,
        numOfRows: rangeY,
        title_localised: language[detail.title],
        chunk_meta_data: {},
        chunk_meta_data_localised: chunk_meta_data_localised,
        default_chunk_metadata_title_localised: language[detail.default_chunk_metadata.title],
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
          for (const feature of col?.features ?? []) {
            if (feature.icon?.path == null) continue;
            await copyImageFromRes(overwrite, feature.icon);
          }
        }
      }
    }
  };

  generateImages = async (overwrite: boolean, modules: Array<CommonModule<unknown>>) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IWorldEnhanced = this._itemDetailMap[mapKey];
      await copyImageToGeneratedFolder(overwrite, detailEnhanced.map_texture);

      for (const row of detailEnhanced.chunk_meta_data_localised) {
        for (const col of row) {
          for (const feature of col?.features ?? []) {
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

  writePages = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
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
