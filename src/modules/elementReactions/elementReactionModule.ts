import fs from 'fs';

import { elementOrder } from 'constants/element';
import { IntermediateFile } from 'constants/intermediateFile';
import { ModuleType } from 'constants/module';
import { paths } from 'constants/paths';
import type { IElement, IElementEnhanced } from 'contracts/element';
import type {
  IElementGridCell,
  IElementReaction,
  IElementReactionEnhanced,
} from 'contracts/elementReaction';
import type { ILocalisation } from 'contracts/localisation';
import type { IStatusEffect, IStatusEffectEnhanced } from 'contracts/statusEffect';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { pad } from 'helpers/stringHelper';
import { getItemFromMapByIntId, readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import type { LocalisationModule } from 'modules/localisation/localisationModule';
import path from 'path';
import { elementReactionMapFromDetailList } from './elementReactionMapFromDetailList';

export class ElementReactionModule extends CommonModule<
  IElementReaction,
  IElementReactionEnhanced
> {
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
    return `${pad(this._baseDetails.length, 3, ' ')} element reactions`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(
      modules,
      ModuleType.Localisation,
    ) as LocalisationModule;
    const elementModule = this.getModuleOfType<IElement>(modules, ModuleType.Elements);
    const statusModule = this.getModuleOfType<IStatusEffect>(modules, ModuleType.StatusEffect);

    this._effectGrid = [];
    const pathToId = (path: string) =>
      path.replace('res://data/elemental_types/', '').replace('.tres', '');

    for (const detail of this._baseDetails) {
      const detailEnhanced: IElementReactionEnhanced = {
        ...detail,
        attacker_element: elementModule.get(pathToId(detail.attacker?.path ?? '')),
        defender_element: elementModule.get(pathToId(detail.defender?.path ?? '')),
        result_status_effect: detail.result.map((et) =>
          statusModule.get(et.path.replace('res://data/status_effects/', '').replace('.tres', '')),
        ),
        toast_message_localised: localeModule.translate(langCode, detail.toast_message),
      };

      this._itemDetailMap[detailEnhanced.id] = detailEnhanced;
    }

    const headingRow: Array<IElementGridCell> = [
      { id: '', is_buff: false, is_debuff: false, buffs: [] },
    ];
    for (const elementId of elementOrder) {
      const element = elementModule.get(elementId) as IElementEnhanced;
      const elementItem = {
        id: elementId,
        iconUrl: element.icon?.path,
        name: element.name_localised,
        is_buff: false,
        is_debuff: false,
        buffs: [],
      };
      headingRow.push(elementItem);
    }
    this._effectGrid.push(headingRow);

    for (const attackerElementId of elementOrder) {
      const attackerElement = elementModule.get(attackerElementId) as IElementEnhanced;
      const effectGridRow: Array<IElementGridCell> = [
        {
          id: attackerElementId,
          iconUrl: attackerElement.icon?.path,
          name: attackerElement.name_localised,
          is_buff: false,
          is_debuff: false,
          buffs: [],
        },
      ];
      for (const defenderElementId of elementOrder) {
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
          buffs: elementReaction.result_status_effect as Array<IStatusEffectEnhanced>,
        });
      }
      this._effectGrid.push(effectGridRow);
    }

    this.isReady = true;
  };

  get = getItemFromMapByIntId(this._itemDetailMap);

  writeAdditionalIntermediate = (langCode: string) => {
    const gridFile = path.join(
      paths().intermediateFolder,
      langCode,
      IntermediateFile.elementReactionsGrid,
    );
    fs.writeFileSync(gridFile, JSON.stringify(this._effectGrid, null, 2), 'utf-8');
  };
}
