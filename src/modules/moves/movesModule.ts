import fs from 'fs';

import { breadcrumb } from 'constant/breadcrumb';
import { handlebarTemplate } from 'constant/handlebar';
import { AppImage } from 'constant/image';
import { IntermediateFile } from 'constant/intermediateFile';
import { UIKeys } from 'constant/localisation';
import { ModuleType } from 'constant/module';
import { paths } from 'constant/paths';
import { routes } from 'constant/route';
import { site } from 'constant/site';
import { IElement, IElementEnhanced } from 'contracts/element';
import { ILocalisation } from 'contracts/localisation';
import { IMonsterForm, IMonsterFormEnhanced, IMonsterFormSimplified } from 'contracts/monsterForm';
import { IMove, IMoveEnhanced } from 'contracts/move';
import { IStatusEffect, IStatusEffectEnhanced } from 'contracts/statusEffect';
import { scaffoldFolderAndDelFileIfOverwrite } from 'helpers/fileHelper';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { generateMetaImage } from 'helpers/imageHelper';
import { sortByStringProperty } from 'helpers/sortHelper';
import { limitLengthWithEllipse, resAndTresTrim } from 'helpers/stringHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { MonsterFormsModule } from 'modules/monsterForms/monsterFormsModule';
import path from 'path';
import { getHandlebar } from 'services/internal/handlebarService';
import { moveMapFromDetailList } from './moveMapFromDetailList';
import { getMoveMetaImage } from './moveMeta';

export class MovesModule extends CommonModule<IMove> {
  private _folder = FolderPathHelper.moves();
  private _moveTagToMovesIdMap: Record<string, Array<string>> = {};

  constructor() {
    super({
      type: ModuleType.Moves,
      intermediateFile: IntermediateFile.moves,
      dependsOn: [
        ModuleType.Localisation, //
        ModuleType.Elements,
        ModuleType.StatusEffect,
      ],
    });
  }

  init = async () => {
    if (this.isReady) return;
    const list = fs.readdirSync(this._folder);

    for (const file of list) {
      const detail = await readItemDetail({
        fileName: file,
        folder: this._folder,
        mapFromDetailList: moveMapFromDetailList(file.replace('.tres', '')),
      });
      this._baseDetails.push(detail);
    }
    return `${this._baseDetails.length} moves`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(modules, ModuleType.Localisation);
    const language = localeModule.get(langCode).messages;
    const elementModule = this.getModuleOfType<IElement>(modules, ModuleType.Elements);
    const statusEffectModule = this.getModuleOfType<IStatusEffect>(
      modules,
      ModuleType.StatusEffect,
    );

    for (const detail of this._baseDetails) {
      for (const tag of detail.tags) {
        const existingMove = this._moveTagToMovesIdMap[tag];
        if (existingMove) {
          this._moveTagToMovesIdMap[tag] = [...this._moveTagToMovesIdMap[tag], detail.id];
        } else {
          this._moveTagToMovesIdMap[tag] = [detail.id];
        }
      }

      const status_effects_elements = detail.status_effects
        .map((se) => statusEffectModule.get(resAndTresTrim(se.path)))
        .filter((er) => er != null) as Array<IStatusEffectEnhanced>;
      const elemental_types_elements = detail.elemental_types
        .map((et) => elementModule.get(resAndTresTrim(et.path)))
        .filter((er) => er != null) as Array<IElementEnhanced>;
      const detailEnhanced: IMoveEnhanced = {
        ...detail,
        name_localised: language[detail.name],
        category_name_localised: language[detail.category_name],
        description_localised: (language[detail.description] ?? '')
          .replaceAll('{status_effect}', status_effects_elements?.[0]?.name_localised)
          .replaceAll('{duration}', (detail.amount ?? 0).toString())
          .replaceAll('{type}', elemental_types_elements?.[0]?.name_localised)
          .replaceAll('{percent}', '50'),
        title_override_localised: language[detail.title_override],
        monsters_that_can_learn: [],
        elemental_types_elements,
        status_effects_elements,
        meta_image_url: `/assets/img/meta/${langCode}${routes.moves}/${encodeURI(detail.id)}.png`,
      };

      this._itemDetailMap[detailEnhanced.id] = detailEnhanced;
    }
    this.isReady = true;
  };

  combineData = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const monsterModule = this.getModuleOfType<IMonsterForm>(
      modules,
      ModuleType.MonsterForms,
      true,
    ) as MonsterFormsModule;

    const moveToMonsterIdMap = monsterModule.getMoveToMonsterIdMap();
    for (const detail of this._baseDetails) {
      const monsters_that_can_learn: Array<IMonsterFormSimplified> = [];
      for (const tag of detail.tags) {
        const monsterFromSrcLists = moveToMonsterIdMap?.[tag] ?? [];
        for (const monsterFromSrc of monsterFromSrcLists) {
          const monster = monsterModule.get(monsterFromSrc.monster_id);
          const monsterDetail = monster as IMonsterFormEnhanced;
          monsters_that_can_learn.push({
            name_localised: monsterDetail.name_localised,
            resource_name: monsterDetail.resource_name,
            icon_url: monsterDetail.icon_url,
            source: monsterFromSrc.source,
            bestiary_index_with_padding: monsterDetail.bestiary_index_with_padding,
          });
        }
      }
      this._itemDetailMap[detail.id].monsters_that_can_learn = monsters_that_can_learn;
    }
  };

  getMoveTagToMoveIdsMap = () => this._moveTagToMovesIdMap;

  generateMetaImages = async (
    langCode: string,
    localeModule: LocalisationModule,
    overwrite: boolean,
  ) => {
    const language: Record<number, ILocalisation> = localeModule.get(langCode).messages;

    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: IMoveEnhanced = this._itemDetailMap[mapKey];

      const outputFullPath = path.join(paths().destinationFolder, detailEnhanced.meta_image_url);
      const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
      if (exists) continue;

      const extraData = await getMoveMetaImage(
        langCode,
        detailEnhanced.elemental_types_elements?.[0]?.icon?.path ?? '../typeless.png',
        detailEnhanced,
        language,
      );
      const template = getHandlebar().getCompiledTemplate<unknown>(
        handlebarTemplate.moveMetaImage,
        { ...site, data: detailEnhanced, ...extraData } as any,
      );

      generateMetaImage({ overwrite, template, langCode, outputFullPath });
    }
  };

  writePages = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(
      modules,
      ModuleType.Localisation,
    ) as LocalisationModule;
    const language: ILocalisation = localeModule.get(langCode);

    const mainBreadcrumb = breadcrumb.move(langCode);
    const list: Array<IMoveEnhanced> = [];
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const details: IMoveEnhanced = this._itemDetailMap[mapKey];
      if (details.id == 'placeholder') continue;
      if (details.id.includes('debug')) continue;

      const status_effects_elements_max_3 = details.status_effects_elements.slice(0, 3);
      if (details.status_effects_elements.length > 3) {
        status_effects_elements_max_3.push({
          icon: { path: AppImage.moreStatusEffects },
          name_localised: language.messages[UIKeys.other],
        } as unknown as IStatusEffect);
      }
      list.push({ ...details, status_effects_elements_max_3 } as IMoveEnhanced);

      const detailPageData = this.getBasicPageData({
        langCode,
        localeModule,
        documentTitle: details.name_localised,
        description: limitLengthWithEllipse(details.description_localised, 125),
        breadcrumbs: [mainBreadcrumb, breadcrumb.moveDetail(langCode, details.name_localised)],
        data: details,
      });
      detailPageData.images.twitter = details.meta_image_url;
      detailPageData.images.facebook = details.meta_image_url;
      await getHandlebar().compileTemplateToFile({
        data: detailPageData,
        outputFiles: [`${langCode}${routes.moves}/${encodeURI(mapKey)}.html`],
        templateFile: handlebarTemplate.moveDetail,
      });
    }

    const sortedList = list.sort(sortByStringProperty((l) => l.name_localised));
    await getHandlebar().compileTemplateToFile({
      data: this.getBasicPageData({
        langCode,
        localeModule,
        documentTitleUiKey: mainBreadcrumb.uiKey,
        breadcrumbs: [mainBreadcrumb],
        data: { list: sortedList },
      }),
      outputFiles: [`${langCode}${routes.moves}/index.html`],
      templateFile: handlebarTemplate.move,
    });
  };
}
