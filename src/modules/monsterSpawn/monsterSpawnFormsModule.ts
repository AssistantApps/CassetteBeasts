import fs from 'fs';

import { IntermediateFile } from 'constant/intermediateFile';
import { ModuleType } from 'constant/module';
import { ILocalisation } from 'contracts/localisation';
import { IMonsterFormEnhanced } from 'contracts/monsterForm';
import {
  IMonsterSpawn,
  IMonsterSpawnDetailsEnhanced,
  IMonsterSpawnEnhanced,
} from 'contracts/monsterSpawn';
import { IWorld } from 'contracts/world';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { monsterToSimplified } from 'mapper/monsterMapper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { monsterSpawnMapFromDetailList } from './monsterSpawnFormMapFromDetailList';

export class MonsterSpawnFormsModule extends CommonModule<IMonsterSpawn> {
  private _folder = FolderPathHelper.monsterSpawn();
  private _monsterToLocationMap: Record<string, Array<string>> = {};

  constructor() {
    super({
      type: ModuleType.MonsterSpawn,
      intermediateFile: IntermediateFile.monsterSpawn,
      dependsOn: [
        ModuleType.Localisation, //
        ModuleType.MonsterForms,
        ModuleType.World,
      ],
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

    return `${this._baseDetails.length}  monster spawns`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(modules, ModuleType.Localisation);
    const language = localeModule.get(langCode).messages;
    // const worldModule = this.getModuleOfType<IWorld>(modules, ModuleType.World);
    const monsterModule = this.getModuleOfType<IMonsterFormEnhanced>(
      modules,
      ModuleType.MonsterForms,
    );

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
        const monster_form = monsterModule.get(
          (spec.monster_form?.path ?? '')
            .replace('res://data/monster_forms/', '')
            .replace('.tres', ''),
        );
        const world_monster = monsterModule.get(
          (spec.world_monster?.path ?? '')
            .replace('res://world/monsters/', '')
            .replace('.tscn', '')
            .toLowerCase(),
        );

        const monsterKey = monster_form.name.replace('_NAME', '').toLowerCase();
        const existingValues = this._monsterToLocationMap[monsterKey];
        if (existingValues != null) {
          this._monsterToLocationMap[monsterKey] = [...existingValues, detail.id];
        } else {
          this._monsterToLocationMap[monsterKey] = [detail.id];
        }

        const isAllDay = spec.hour_min == 0 && spec.hour_max == 24;
        species_enhanced.push({
          hour_min: isAllDay ? undefined : spec.hour_min,
          hour_max: isAllDay ? undefined : spec.hour_max,
          weight: undefined,
          monster_form: undefined,
          monster_form_monster: monster_form != null ? monsterToSimplified(monster_form) : null,
          monster_form_percent: Math.round((spec.weight / totalWeight) * 1000) / 10,
          world_monster: undefined,
          world_monster_monster: world_monster != null ? monsterToSimplified(world_monster) : null,
          world_monster_percent: Math.round((spec.weight / totalOverworldWeight) * 1000) / 10,
          available_specific_time: isAllDay ? undefined : true,
        });
      }
      const detailEnhanced: IMonsterSpawnEnhanced = {
        ...detail,
        habitat_name_localised: language[detail.habitat_name],
        species: undefined,
        species_enhanced,
      };

      this._itemDetailMap[detail.id] = detailEnhanced;
    }

    this.isReady = true;
  };

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
