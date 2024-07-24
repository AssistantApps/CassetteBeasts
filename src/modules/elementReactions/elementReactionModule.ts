import fs from 'fs';

import { IntermediateFile } from 'constant/intermediateFile';
import { ModuleType } from 'constant/module';
import { IElement, IElementEnhanced } from 'contracts/element';
import {
  IElementGridCell,
  IElementReaction,
  IElementReactionEnhanced,
} from 'contracts/elementReaction';
import { ILocalisation } from 'contracts/localisation';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { getItemFromMapByIntId, readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { elementReactionMapFromDetailList } from './elementReactionMapFromDetailList';
import { elementOrder } from 'constant/element';
import { breadcrumb } from 'constant/breadcrumb';
import { routes } from 'constant/route';
import { getHandlebar } from 'services/internal/handlebarService';
import { handlebarTemplate } from 'constant/handlebar';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { IStatusEffect, IStatusEffectEnhanced } from 'contracts/statusEffect';

export class ElementReactionModule extends CommonModule<IElementReaction> {
  private _folder = FolderPathHelper.elementReactions();
  private _effectGrid: Array<Array<IElementGridCell>> = [];

  constructor() {
    super({
      type: ModuleType.ElementReaction,
      intermediateFile: IntermediateFile.elementReactions,
      dependsOn: [ModuleType.Localisation, ModuleType.Elements, ModuleType.StatusEffect],
    });
  }

  init = async () => {
    this._baseDetails = [];
    this._itemDetailMap = {};
    if (this.isReady) return;
    const list = fs.readdirSync(this._folder);

    for (const file of list) {
      const detail = await readItemDetail({
        fileName: file,
        folder: this._folder,
        mapFromDetailList: elementReactionMapFromDetailList(file.replace('.tres', '')),
      });
      this._baseDetails.push(detail);
    }
    return `${this._baseDetails.length} element reactions`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(modules, ModuleType.Localisation);
    const language = localeModule.get(langCode).messages;
    const elementModule = this.getModuleOfType<IElement>(modules, ModuleType.Elements);
    const statusModule = this.getModuleOfType<IStatusEffect>(modules, ModuleType.StatusEffect);

    this._effectGrid = [];
    const pathToId = (path: string) =>
      path.replace('res://data/elemental_types/', '').replace('.tres', '');

    for (const detail of this._baseDetails) {
      const detailEnhanced: IElementReactionEnhanced = {
        ...detail,
        attacker_element: elementModule.get(pathToId(detail.attacker.path)),
        defender_element: elementModule.get(pathToId(detail.defender.path)),
        result_status_effect: detail.result.map((et) =>
          statusModule.get(et.path.replace('res://data/status_effects/', '').replace('.tres', '')),
        ),
        toast_message_localised: language[detail.toast_message],
      };

      this._itemDetailMap[detailEnhanced.id] = detailEnhanced;
    }

    const headingRow: Array<IElementGridCell> = [
      { id: '', is_buff: false, is_debuff: false, buffs: [] },
    ];
    for (const elementId of elementOrder) {
      const element = elementModule.get(elementId) as IElementEnhanced;
      headingRow.push({
        id: elementId,
        iconUrl: element.icon.path,
        name: element.name_localised,
        is_buff: false,
        is_debuff: false,
        buffs: [],
      });
    }
    this._effectGrid.push(headingRow);

    for (const attackerElementId of elementOrder) {
      const attackerElement = elementModule.get(attackerElementId) as IElementEnhanced;
      const effectGridRow: Array<IElementGridCell> = [
        {
          id: attackerElementId,
          iconUrl: attackerElement.icon.path,
          name: attackerElement.name_localised,
          is_buff: false,
          is_debuff: false,
          buffs: [],
        },
      ];
      for (const defenderElementId of elementOrder) {
        // const defenderElement = elementModule.get(defenderElementId);

        const elementReactionId = `${attackerElementId}_on_${defenderElementId}`;
        const elementReaction: IElementReactionEnhanced = this._itemDetailMap[elementReactionId];
        if (elementReaction == null) {
          effectGridRow.push({
            id: elementReactionId,
            is_buff: false,
            is_debuff: false,
            buffs: [],
          });
          continue;
        }

        effectGridRow.push({
          id: elementReactionId,
          is_buff: elementReaction.result_status_effect?.[0]?.is_buff ?? false,
          is_debuff: elementReaction.result_status_effect?.[0]?.is_debuff ?? false,
          message: elementReaction.toast_message_localised,
          buffs: elementReaction.result_status_effect,
        });
      }
      this._effectGrid.push(effectGridRow);
    }

    this.isReady = true;
  };

  get = getItemFromMapByIntId(this._itemDetailMap);

  writePages = async (langCode: string, modules: Array<CommonModule<unknown>>) => {
    const mainBreadcrumb = breadcrumb.element(langCode);
    const list: Array<IElementReaction> = [];
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const details: IElementReaction = this._itemDetailMap[mapKey];
      list.push(details);
      // const relativePath = `${langCode}${routes.characters}/${encodeURI(mapKey)}.html`;
      // const detailPageData = this.getBasicPageData({
      //   langCode,
      //   localeModule,
      //   documentTitle: details.name_localised,
      //   breadcrumbs: [mainBreadcrumb, breadcrumb.characterDetail(langCode, details.name_localised)],
      //   data: details,
      //   relativePath,
      // });
      // detailPageData.images.twitter = details.meta_image_url;
      // detailPageData.images.facebook = details.meta_image_url;
      // await getHandlebar().compileTemplateToFile({
      //   data: detailPageData,
      //   outputFiles: [relativePath],
      //   templateFile: handlebarTemplate.characterDetail,
      // });
    }
    const relativePath = `${langCode}${routes.elementReactions}/index.html`;

    await getHandlebar().compileTemplateToFile({
      data: this.getBasicPageData({
        langCode,
        modules,
        documentTitleUiKey: mainBreadcrumb.uiKey,
        breadcrumbs: [mainBreadcrumb],
        data: { grid: this._effectGrid },
        relativePath,
      }),
      outputFiles: [relativePath],
      templateFile: handlebarTemplate.elementReaction,
    });
  };
}
