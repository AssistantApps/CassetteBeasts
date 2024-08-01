import fs from 'fs';

import { IntermediateFile } from 'constant/intermediateFile';
import { ModuleType } from 'constant/module';
import { ILocalisation } from 'contracts/localisation';
import {
  IMonsterSpawn,
  IMonsterSpawnDetailsEnhanced,
  IMonsterSpawnEnhanced,
} from 'contracts/monsterSpawn';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { pad } from 'helpers/stringHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { monsterSpawnMapFromDetailList } from './monsterSpawnFormMapDetailList';

export class MonsterSpawnModule extends CommonModule<IMonsterSpawn> {
  private _folder = FolderPathHelper.monsterSpawn();
  private _monsterToLocationMap: Record<string, Array<string>> = {};
  private _mapCoordToMonsterSpawnMap: Record<string, Array<IMonsterSpawnDetailsEnhanced>> = {};

  constructor() {
    super({
      type: ModuleType.MonsterSpawn,
      intermediateFile: IntermediateFile.monsterSpawn,
      dependsOn: [ModuleType.Localisation],
    });
  }

  init = async () => {
    if (this.isReady) return;

    const list = fs.readdirSync(this._folder);

    for (const file of list) {
      const id = file.replace('.tres', '');
      const detail = await readItemDetail({
        fileName: file,
        folder: this._folder,
        mapFromDetailList: monsterSpawnMapFromDetailList(id),
      });
      this._baseDetails.push(detail);
    }

    return `${pad(this._baseDetails.length, 3, ' ')} monster spawns`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(modules, ModuleType.Localisation);
    const language = localeModule.get(langCode).messages;

    for (const detail of this._baseDetails) {
      const species_enhanced: Array<IMonsterSpawnDetailsEnhanced> = [];
      const totalWeight = detail.species
        .map((s) => s.weight)
        .reduce((partial, cur) => partial + cur, 0);
      const totalOverworldWeight = detail.species
        .filter((s) => s.world_monster != null)
        .map((s) => s.weight)
        .reduce((partial, cur) => partial + cur, 0);

      for (const spec of detail.species) {
        const monsterKey = (spec.monster_form?.path ?? '')
          .replace('res://data/monster_forms/', '')
          .replace('.tres', '');
        const worldMonsterKey = (spec.world_monster?.path ?? '')
          .replace('res://world/monsters/', '')
          .replace('.tscn', '')
          .toLowerCase();

        const existingValues = this._monsterToLocationMap[monsterKey];
        if (existingValues != null) {
          this._monsterToLocationMap[monsterKey] = [...existingValues, detail.id];
        } else {
          this._monsterToLocationMap[monsterKey] = [detail.id];
        }

        const isAllDay = spec.hour_min == 0 && spec.hour_max == 24;
        const percentMonster = (spec.weight / totalWeight) * 100;
        const baseItem: IMonsterSpawnDetailsEnhanced = {
          overworldMonsterId: undefined,
          world_monster: undefined,
          weight: undefined,
          monster_form: undefined,
          hour_min: isAllDay ? undefined : spec.hour_min,
          hour_max: isAllDay ? undefined : spec.hour_max,
          monsterId: monsterKey,
          // monster: monster_form != null ? monsterToSimplified(monster_form) : null,
          percent: percentMonster,
          percentStr: percentMonster.toFixed(2),
          available_specific_time: isAllDay ? undefined : true,
        };
        if (worldMonsterKey.length > 0) {
          const percentWorld = (spec.weight / totalOverworldWeight) * 100;
          species_enhanced.push({
            ...baseItem,
            overworldMonsterId: worldMonsterKey,
            percent: percentWorld,
            percentStr: percentWorld.toFixed(2),
          });
        }
        species_enhanced.push(baseItem);
      }
      const habitat_coords: Array<string> = [];
      for (const extResource of detail.habitat_overworld_chunks) {
        const coordStr = extResource.path
          .replace('res://data/map_metadata/overworld_chunk_metadata/', '')
          .replace('.tres', '');
        habitat_coords.push(coordStr);
        this._mapCoordToMonsterSpawnMap[coordStr] = species_enhanced;
        // const coord = coordStr.split('_');
        // habitat_coords.push({
        //   x: parseInt(coord[0]),
        //   y: parseInt(coord[1]),
        // });
      }
      const detailEnhanced: IMonsterSpawnEnhanced = {
        ...detail,
        habitat_name_localised: language[detail.habitat_name],
        species: undefined,
        species_enhanced,
        habitat_coords,
      };

      this._itemDetailMap[detail.id] = detailEnhanced;
    }

    this.isReady = true;
  };

  getMonsterToLocationMap = () => this._monsterToLocationMap;
  getMapCoordToMonsterSpawnMap = () => this._mapCoordToMonsterSpawnMap;

  getImagesFromGameFiles = async (overwrite: boolean) => {
    // for (const mapKey of Object.keys(this._itemDetailMap)) {
    //   const detailEnhanced: IMonsterFormEnhanced = this._itemDetailMap[mapKey];
    //   await copyImageFromRes(overwrite, { id: 0, path: detailEnhanced.icon_url, type: '' });
    //   await copyImageFromRes(overwrite, detailEnhanced.tape_sticker_texture);
    // }
  };

  generateImages = async (overwrite: boolean, modules: Array<CommonModule<unknown>>) => {
    // for (const mapKey of Object.keys(this._itemDetailMap)) {
    //   const detailEnhanced: IMonsterFormEnhanced = this._itemDetailMap[mapKey];
    //   await copyImageToGeneratedFolder(overwrite, detailEnhanced.tape_sticker_texture);
    //   if (detailEnhanced.animations == null || detailEnhanced.animations.length < 1) continue;
    //   const firstFrame = detailEnhanced.animations[0].frames[0];
    //   await cutImageFromSpriteSheet({
    //     overwrite,
    //     spriteFilePath: detailEnhanced.icon_url,
    //     boxSelection: firstFrame,
    //   });
    //   await createWebpFromISpriteAnim({
    //     overwrite,
    //     spriteFilePath: detailEnhanced.icon_url,
    //     animations: detailEnhanced?.animations ?? [],
    //   });
    // }
  };
}
