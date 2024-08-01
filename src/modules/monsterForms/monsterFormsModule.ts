import fs from 'fs';
import path from 'path';

import { breadcrumb } from 'constant/breadcrumb';
import { handlebarTemplate } from 'constant/handlebar';
import { IntermediateFile } from 'constant/intermediateFile';
import { UIKeys } from 'constant/localisation';
import { ModuleType } from 'constant/module';
import { paths } from 'constant/paths';
import { routes } from 'constant/route';
import { IElement } from 'contracts/element';
import { IExternalResource } from 'contracts/externalResource';
import { ILocalisation } from 'contracts/localisation';
import {
  IMonsterForm,
  IMonsterFormEnhanced,
  IMonsterFormMoveSource,
  IMonsterFormSimplified,
} from 'contracts/monsterForm';
import {
  IMonsterSpawn,
  IMonsterSpawnEnhanced,
  IMonsterSpawnHabitatDetails,
} from 'contracts/monsterSpawn';
import { IMove } from 'contracts/move';
import { ISpriteAnim } from 'contracts/spriteAnim';
import { ISubResource, ISubResourceMonsterEnhanced } from 'contracts/subResource';
import {
  createFoldersOfDestFilePath,
  getAnimFileName,
  scaffoldFolderAndDelFileIfOverwrite,
} from 'helpers/fileHelper';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import {
  copyImageFromRes,
  copyImageToGeneratedFolder,
  cutImageFromSpriteSheet,
  generateMetaImage,
} from 'helpers/imageHelper';
import { monsterSort } from 'helpers/sortHelper';
import { limitLengthWithEllipse, pad, resAndTresTrim } from 'helpers/stringHelper';
import { copyWavFile } from 'helpers/wavHelper';
import { createWebpFromISpriteAnim } from 'helpers/webpHelper';
import { monsterToSimplified } from 'mapper/monsterMapper';
import { moveToSimplified } from 'mapper/moveMapper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { MonsterSpawnModule } from 'modules/monsterSpawn/monsterSpawnModule';
import { MovesModule } from 'modules/moves/movesModule';
import { getHandlebar } from '../../services/internal/handlebarService';
import { getEvolutionMonster, monsterFormMapFromDetailList } from './monsterFormMapFromDetailList';
import { getMonsterFormMetaImage } from './monsterFormMeta';

export class MonsterFormsModule extends CommonModule<IMonsterForm> {
  private _folders = [
    FolderPathHelper.monsterForms(),
    FolderPathHelper.monsterFormsSecret(),
    // FolderPathHelper.monsterFormsUnlisted(),
  ];
  private _evolutionFromMap: Record<string, string> = {};
  private _moveToMonsterIdsMap: Record<string, Array<IMonsterFormMoveSource>> = {};

  constructor() {
    super({
      type: ModuleType.MonsterForms,
      intermediateFile: IntermediateFile.monsterForms,
      dependsOn: [
        ModuleType.Localisation,
        ModuleType.Elements,
        ModuleType.Moves,
        ModuleType.MonsterSpriteAnim,
      ],
    });
  }

  getMoveToMonsterIdMap = () => this._moveToMonsterIdsMap;

  init = async () => {
    if (this.isReady) return;

    for (const folder of this._folders) {
      const list = fs.readdirSync(folder);
      const folderName = folder.replace(FolderPathHelper.dataFolder(), '').substring(1);

      for (const file of list) {
        const detail = await readItemDetail({
          fileName: file,
          folder: folder,
          mapFromDetailList: monsterFormMapFromDetailList(folderName),
        });
        this._baseDetails.push(detail);
      }
    }

    return `${pad(this._baseDetails.length, 3, ' ')} monsters`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(modules, ModuleType.Localisation);
    const language = localeModule.get(langCode).messages;
    const elementModule = this.getModuleOfType<IElement>(modules, ModuleType.Elements);
    const moveModule = this.getModuleOfType<IMove>(
      modules,
      ModuleType.Moves,
    ) as unknown as MovesModule;
    const spriteAnimModule = this.getModuleOfType<ISpriteAnim>(
      modules,
      ModuleType.MonsterSpriteAnim,
    );

    this._buildEvolutionFromMap();

    for (const detail of this._baseDetails) {
      const mapKey = detail.name.replace('_NAME', '').toLowerCase();
      const icon_url = detail.battle_sprite_path.replace('.json', '.png');
      const sprite_anim_key = detail.battle_sprite_path
        .replace('res://sprites/monsters/', '')
        .replace('.json', '');

      const moveTagToMoveIdsMap = moveModule.getMoveTagToMoveIdsMap();
      const moveIds = moveTagToMoveIdsMap?.[mapKey] ?? [];

      const detailEnhanced: IMonsterFormEnhanced = {
        ...detail,
        id: mapKey,
        resource_name: mapKey,
        bestiary_index_with_padding:
          detail.bestiary_index >= 0 ? pad(detail.bestiary_index, 3) : '???',
        name_localised: language[detail.name],
        description_localised: language[detail.description],
        icon_url,
        sprite_sheet_path: detail.battle_sprite_path.replace('.json', '.sheet.png'),
        evolution_specialization_question_localised:
          language[detail.evolution_specialization_question],
        fusion_name_prefix_localised: language[detail.fusion_name_prefix],
        fusion_name_suffix_localised: language[detail.fusion_name_suffix],
        bestiary_bios_localised: detail.bestiary_bios.map((b) =>
          language[b].replaceAll("\\'", "'").replaceAll('\\"', '"'),
        ),
        unlock_ability_localised: language[UIKeys.unlockedAbility].replace(
          '{ability}',
          detail.unlock_ability,
        ),
        elemental_types: undefined,
        elemental_types_elements: detail.elemental_types.map((et) =>
          elementModule.get(resAndTresTrim(et.path)),
        ),
        initial_moves: undefined,
        initial_moves_moves: detail.initial_moves.map((im) => ({
          ...moveModule.get(resAndTresTrim(im.path)),
          monsters_that_can_learn: [],
          status_effects_elements: [],
        })),
        tape_upgrades: undefined,
        tape_upgrades_moves: detail.tape_upgrades.map((tu) => {
          let path = (tu as IExternalResource)?.path;
          if (path == null) {
            path = (tu as ISubResource)?.sticker?.path;
          }
          return {
            ...moveModule.get(resAndTresTrim(path ?? '')),
            monsters_that_can_learn: [],
            status_effects_elements: [],
          };
        }),
        animations: (spriteAnimModule.get(sprite_anim_key)?.animations ?? []).map((a, idx) => ({
          ...a,
          imageUrl: getAnimFileName(icon_url, idx),
        })),
        learnable_moves: moveIds.map(moveModule.get).map(moveToSimplified),
        meta_image_url: `/assets/img/meta/${langCode}${routes.monsters}/${encodeURI(mapKey)}.png`,
        battle_cry_audio_url: detail.battle_cry?.path?.replace('res://sfx/', '/assets/audio/'),
        isSecret: detail.folder == 'monster_forms_secret',

        // initialise the following later
        evolutions_monster: [],
        total_evolutions: 0,
        spawn_overworld_locations: [],
        spawn_backup_locations: [],
        has_locations: false,
      };

      this._setupMoveMap(detailEnhanced, mapKey, language);
      this._itemDetailMap[mapKey] = detailEnhanced;
    }

    for (const mapKey of Object.keys(this._itemDetailMap)) {
      this._itemDetailMap[mapKey].evolutions_monster = this._itemDetailMap[mapKey].evolutions
        .map((evo) =>
          getEvolutionMonster(
            language,
            evo,
            moveModule,
            this._itemDetailMap[evo.resource_name] as IMonsterFormEnhanced,
          ),
        )
        .filter((m) => m != null);

      const prevMapKey = this._evolutionFromMap[mapKey];
      if (prevMapKey != null) {
        const fakeResource = { id: 0, type: 'Custom', resource_name: prevMapKey };
        this._itemDetailMap[mapKey].evolution_from_monster = getEvolutionMonster(
          language,
          fakeResource,
          moveModule,
          this._itemDetailMap[fakeResource.resource_name],
        );
      }
      this._itemDetailMap[mapKey].total_evolutions =
        (this._itemDetailMap[mapKey].evolutions_monster?.length ?? 0) +
        (this._itemDetailMap[mapKey].evolution_from_monster != null ? 1 : 0);
    }
    this.isReady = true;
  };

  combineData = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const monsterSpawnModule = this.getModuleOfType<IMonsterSpawn>(
      modules,
      ModuleType.MonsterSpawn,
      true,
    ) as MonsterSpawnModule;

    const monsterToLocationMap = monsterSpawnModule.getMonsterToLocationMap();
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const locations = monsterToLocationMap[mapKey];
      if (locations == null) continue;

      const overworldHabitats: Array<IMonsterSpawnHabitatDetails> = [];
      const backupHabitats: Array<IMonsterSpawnHabitatDetails> = [];
      for (const locationId of locations) {
        const monsterSpawn = monsterSpawnModule.get(locationId) as unknown as IMonsterSpawnEnhanced;

        for (const species of monsterSpawn.species_enhanced) {
          if (species.monsterId == mapKey) {
            if (monsterSpawn.habitat_name_localised == null) continue;
            const habitat = {
              id: monsterSpawn.id,
              percent: species.percent,
              percentStr: species.percentStr,
              overworldSprite: undefined,
              habitat_name_localised: monsterSpawn.habitat_name_localised,
              hour_min: species.hour_min,
              hour_max: species.hour_max,
              available_specific_time: species.available_specific_time,
            };
            if (species.overworldMonsterId != null) {
              const overworldMon = this._itemDetailMap[species.overworldMonsterId];
              if (overworldMon != null) {
                overworldHabitats.push({
                  ...habitat,
                  overworldSprite: overworldMon.icon_url,
                });
                continue;
              }
            }

            backupHabitats.push(habitat);
          }
        }
      }
      this._itemDetailMap[mapKey].spawn_overworld_locations = overworldHabitats.sort(
        (a, b) => b.percent - a.percent,
      );
      this._itemDetailMap[mapKey].spawn_backup_locations = backupHabitats.sort(
        (a, b) => b.percent - a.percent,
      );
      this._itemDetailMap[mapKey].has_locations =
        overworldHabitats.length > 0 || backupHabitats.length > 0;
    }
  };

  copyWav = async (overwrite: boolean) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IMonsterFormEnhanced = this._itemDetailMap[mapKey];
      if (detailEnhanced.battle_cry_audio_url == null) continue;

      const outputFullPath = path.join(
        paths().destinationFolder,
        detailEnhanced.battle_cry_audio_url,
      );
      const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
      if (exists) break;

      copyWavFile(detailEnhanced.battle_cry?.path, outputFullPath);
    }
  };

  getImagesFromGameFiles = async (overwrite: boolean) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IMonsterFormEnhanced = this._itemDetailMap[mapKey];
      await copyImageFromRes(overwrite, { id: 0, path: detailEnhanced.icon_url, type: '' });
      await copyImageFromRes(overwrite, detailEnhanced.tape_sticker_texture);
    }
  };

  generateImages = async (overwrite: boolean, modules: Array<CommonModule<unknown>>) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IMonsterFormEnhanced = this._itemDetailMap[mapKey];

      await copyImageToGeneratedFolder(overwrite, detailEnhanced.tape_sticker_texture);

      if (detailEnhanced.animations == null || detailEnhanced.animations.length < 1) continue;
      const firstFrame = detailEnhanced.animations[0].frames[0];
      await cutImageFromSpriteSheet({
        overwrite,
        spriteFilePath: detailEnhanced.icon_url,
        boxSelection: firstFrame,
      });
      await createWebpFromISpriteAnim({
        overwrite,
        spriteFilePath: detailEnhanced.icon_url,
        animations: detailEnhanced?.animations ?? [],
      });
    }
  };

  generateMetaImages = async (
    langCode: string,
    localeModule: LocalisationModule,
    overwrite: boolean,
  ) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IMonsterFormEnhanced = this._itemDetailMap[mapKey];

      await this._generateMonsterMetaImage(langCode, overwrite, detailEnhanced);
    }
  };

  writePages = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const mainBreadcrumb = breadcrumb.monster(langCode);
    const list: Array<IMonsterFormEnhanced> = [];
    const simplifiedMonsters: Array<IMonsterFormSimplified> = [];
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const details: IMonsterFormEnhanced = this._itemDetailMap[mapKey];
      list.push(details);
      simplifiedMonsters.push(monsterToSimplified(details));

      const relativePath = `${langCode}${routes.monsters}/${encodeURI(mapKey)}.html`;
      const detailPageData = this.getBasicPageData({
        langCode,
        modules,
        documentTitle: details.name_localised,
        description: limitLengthWithEllipse(details.bestiary_bios_localised.join(' '), 125),
        breadcrumbs: [mainBreadcrumb, breadcrumb.monsterDetail(langCode, details.name_localised)],
        data: details,
        relativePath,
      });
      detailPageData.images.twitter = details.meta_image_url;
      detailPageData.images.facebook = details.meta_image_url;
      await getHandlebar().compileTemplateToFile({
        data: detailPageData,
        outputFiles: [relativePath],
        templateFile: handlebarTemplate.monsterDetail,
      });
    }

    const simpleMonsterJsonFile = `assets/json${routes.monsters}.json`;
    const destMonsterJsonFile = path.join(paths().destinationFolder, simpleMonsterJsonFile);
    createFoldersOfDestFilePath(destMonsterJsonFile);
    fs.writeFileSync(destMonsterJsonFile, JSON.stringify(simplifiedMonsters, null, 2), 'utf-8');

    const relativePath = `${langCode}${routes.monsters}/index.html`;
    await getHandlebar().compileTemplateToFile({
      data: this.getBasicPageData({
        langCode,
        modules,
        documentTitleUiKey: mainBreadcrumb.uiKey,
        breadcrumbs: [mainBreadcrumb],
        data: { list: list.sort(monsterSort) },
        relativePath,
      }),
      outputFiles: [relativePath],
      templateFile: handlebarTemplate.monster,
    });
  };

  private _buildEvolutionFromMap = () => {
    this._evolutionFromMap = {};
    for (const detail of this._baseDetails) {
      if (detail.evolutions.length > 0) {
        const mapKey = detail.name.replace('_NAME', '').toLowerCase();
        for (const evolution of detail.evolutions) {
          this._evolutionFromMap[(evolution as ISubResourceMonsterEnhanced).resource_name] = mapKey;
        }
      }
    }
  };

  private _setupMoveMap = (
    detail: IMonsterFormEnhanced,
    mapKey: string,
    language: Record<string, string>,
  ) => {
    for (const move of [...detail.move_tags, 'any']) {
      const newEntry: IMonsterFormMoveSource = {
        monster_id: mapKey,
        source: language[UIKeys.stickers],
      };
      const existingMove = this._moveToMonsterIdsMap[move];
      if (existingMove) {
        this._moveToMonsterIdsMap[move] = [...this._moveToMonsterIdsMap[move], newEntry];
      } else {
        this._moveToMonsterIdsMap[move] = [newEntry];
      }
    }

    for (const initialMove of detail.initial_moves_moves) {
      const newEntry: IMonsterFormMoveSource = {
        monster_id: mapKey,
        source: '',
      };
      const existingMove = this._moveToMonsterIdsMap[initialMove.id];
      if (existingMove) {
        this._moveToMonsterIdsMap[initialMove.id] = [
          ...this._moveToMonsterIdsMap[initialMove.id],
          newEntry,
        ];
      } else {
        this._moveToMonsterIdsMap[initialMove.id] = [newEntry];
      }
    }

    for (
      let tapeUpgradeIdx = 0;
      tapeUpgradeIdx < detail.tape_upgrades_moves.length;
      tapeUpgradeIdx++
    ) {
      const tapeUpgrade = detail.tape_upgrades_moves[tapeUpgradeIdx];
      const move = tapeUpgrade.id;
      const newEntry: IMonsterFormMoveSource = {
        monster_id: mapKey,
        source: '★'.repeat(tapeUpgradeIdx + 1),
      };
      const existingMove = this._moveToMonsterIdsMap[move];
      if (existingMove) {
        this._moveToMonsterIdsMap[move] = [...this._moveToMonsterIdsMap[move], newEntry];
      } else {
        this._moveToMonsterIdsMap[move] = [newEntry];
      }
    }
  };

  private _generateMonsterMetaImage = async (
    langCode: string,
    overwrite: boolean,
    detailEnhanced: IMonsterFormEnhanced,
  ) => {
    const outputFullPath = path.join(paths().destinationFolder, detailEnhanced.meta_image_url);
    const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
    if (exists) return;

    const extraData = await getMonsterFormMetaImage(
      detailEnhanced.tape_sticker_texture.path,
      detailEnhanced.elemental_types_elements[0].icon.path,
    );
    const template = getHandlebar().getCompiledTemplate<unknown>(
      handlebarTemplate.monsterMetaImage,
      { data: detailEnhanced, ...extraData } as any,
    );

    generateMetaImage({ overwrite, template, langCode, outputFullPath });
  };
}
