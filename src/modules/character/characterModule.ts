import fs from 'fs';
import path from 'path';

import { handlebarTemplate } from 'constants/handlebar';
import { cutBarkleyPortrait } from 'constants/image';
import { IntermediateFile } from 'constants/intermediateFile';
import { ModuleType } from 'constants/module';
import { paths } from 'constants/paths';
import { routes } from 'constants/route';
import { site } from 'constants/site';
import type { ICharacter, ICharacterEnhanced, ICharacterSfx } from 'contracts/character';
import type { IElement } from 'contracts/element';
import type { ILocalisation } from 'contracts/localisation';
import { monsterToSimplified } from 'contracts/mapper/monsterMapper';
import type { IMonsterFormEnhanced, IMonsterFormSimplified } from 'contracts/monsterForm';
import type { ISpriteAnim } from 'contracts/spriteAnim';
import { getAnimFileName, scaffoldFolderAndDelFileIfOverwrite } from 'helpers/fileHelper';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import {
  copyImageFromRes,
  copyImageToGeneratedFolder,
  cutImageFromSpriteSheet,
  generateMetaImage,
} from 'helpers/imageHelper';
import { pad } from 'helpers/stringHelper';
import { createWebpFromISpriteAnim } from 'helpers/webpHelper';
import type { AssistantAppsModule } from 'modules/assistantApps/assistantAppsModule';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { getHandlebar } from 'services/internal/handlebarService';
import { characterMapFromDetailList } from './characterMapFromDetailList';
import { getCharacterListMetaImage, getCharacterMetaImage } from './characterMeta';
import { getCharacterPartnerTapeImage } from './characterPartnerTape';

export class CharacterModule extends CommonModule<ICharacter, ICharacterEnhanced> {
  private _folder = FolderPathHelper.characters();

  constructor() {
    super({
      type: ModuleType.Characters,
      intermediateFile: IntermediateFile.characters,
      dependsOn: [
        ModuleType.Localisation,
        ModuleType.AssistantApps,
        ModuleType.MonsterForms,
        ModuleType.CharacterSpriteAnim,
        ModuleType.Elements,
      ],
    });
  }

  init = async () => {
    if (this.isReady) return;
    const list = fs.readdirSync(this._folder);
    const portraitFiles = fs
      .readdirSync(FolderPathHelper.characterPortraits())
      .filter((file) => file.endsWith('.png'));

    for (const file of list) {
      const detail = await readItemDetail({
        fileName: file,
        folder: this._folder,
        mapFromDetailList: characterMapFromDetailList,
      });

      const portraitName = detail.resource_name.replace('.tres', '');
      detail.portraits = portraitFiles
        .filter((file) => file.includes(portraitName))
        .map((file) => `res://sprites/portraits/${file}`);
      this._baseDetails.push(detail);
    }

    return `${pad(this._baseDetails.length, 3, ' ')} characters`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const localeModule = this.getModuleOfType<ILocalisation>(
      modules,
      ModuleType.Localisation,
    ) as LocalisationModule;
    const monsterModule = this.getModuleOfType<IMonsterFormEnhanced>(
      modules,
      ModuleType.MonsterForms,
    );
    const elementModule = this.getModuleOfType<IElement>(modules, ModuleType.Elements);
    const spriteAnimModule = this.getModuleOfType<ISpriteAnim>(
      modules,
      ModuleType.CharacterSpriteAnim,
    );

    for (const detail of this._baseDetails) {
      const mapKey = detail.name.replace('_NAME', '').toLowerCase();
      if (mapKey.length < 1) continue;
      if (mapKey == 'default_player') continue;

      const battle_sprite_path = detail.battle_sprite?.path ?? '';
      const partner_signature_species_path = detail.partner_signature_species?.path ?? '';
      const icon_url = battle_sprite_path.replace('.json', '.png');
      const sprite_sheet_path = battle_sprite_path.replace('.json', '.sheet.png');
      const sprite_anim_key = battle_sprite_path
        .replace('res://sprites/characters/battle/', '')
        .replace('res://sprites/characters/world/', '')
        .replace('.json', '');
      const tapeOverrideElementId = (detail.partner_signature_species_type_override?.path ?? '')
        .replace('res://data/elemental_types/', '')
        .replace('.tres', '');

      const animations = (spriteAnimModule.get(sprite_anim_key)?.animations ?? []).map(
        (a, idx) => ({
          ...a,
          imageUrl: getAnimFileName(icon_url, idx),
        }),
      );
      const reorderedAnimation = [...(animations ?? [])];
      if (reorderedAnimation.length > 4) {
        const tempAnim = reorderedAnimation[0];
        reorderedAnimation[0] = reorderedAnimation[2];
        reorderedAnimation[2] = tempAnim;
      }
      const partner_signature_species_monsters = monsterModule.get(
        partner_signature_species_path
          .replace('res://data/monster_forms/', '')
          .replace('.tres', ''),
      );
      const detailEnhanced: ICharacterEnhanced = {
        ...detail,
        name_localised: localeModule.translate(langCode, detail.name),
        resource_name: detail.resource_name.replace('.tres', ''),
        icon_url,
        sprite_sheet_path,
        battle_sprite_path,
        animations: reorderedAnimation,
        partner_signature_species_monsters: monsterToSimplified(partner_signature_species_monsters),
        partner_signature_species_tape_sticker_texture:
          partner_signature_species_monsters?.tape_sticker_texture?.path ?? '',
        partner_signature_species_elemental_types_elements:
          partner_signature_species_monsters?.elemental_types_elements[0]?.icon?.path ?? '',
        partner_signature_species_type_override_element: elementModule.get(tapeOverrideElementId),
        meta_image_url: `/assets/img/meta/${langCode}${routes.characters}/${encodeURI(mapKey)}.png`,
        partner_image_url: `/assets/img/meta/${langCode}${routes.characters}/${encodeURI(
          `${mapKey}-partner`,
        )}.png`,

        // initialised the following later
        audioFiles: [],
      };

      this._itemDetailMap[mapKey] = detailEnhanced;
    }
    this.isReady = true;
  };

  combineData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const characterSfxModule = this.getModuleOfType<ICharacterSfx>(
      modules,
      ModuleType.CharacterSfx,
      true,
    );

    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const charSfx = characterSfxModule.get(mapKey);
      this._itemDetailMap[mapKey].audioFiles = charSfx?.audioFiles ?? [];
    }
  };

  getImagesFromGameFiles = async (overwrite: boolean) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: ICharacterEnhanced = this._itemDetailMap[mapKey];

      for (const portraitFile of detailEnhanced.portraits) {
        await copyImageFromRes(overwrite, { id: 0, path: portraitFile, type: '' });
      }

      await copyImageFromRes(overwrite, { id: 0, path: detailEnhanced.icon_url, type: '' });
    }
  };

  generateImages = async (overwrite: boolean, modules: Array<CommonModule<unknown, unknown>>) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: ICharacterEnhanced = this._itemDetailMap[mapKey];

      for (const portraitFile of detailEnhanced.portraits) {
        await copyImageToGeneratedFolder(
          overwrite,
          { id: 0, path: portraitFile, type: '' },
          mapKey != 'dog' ? null : cutBarkleyPortrait,
        );
      }

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
        animations: detailEnhanced.animations,
      });
    }
  };

  generateMetaImages = async (
    langCode: string,
    localeModule: LocalisationModule,
    modules: Array<CommonModule<unknown, unknown>>,
    overwrite: boolean,
  ) => {
    const assistantAppsModule = this.getModuleOfType<ILocalisation>(
      modules,
      ModuleType.AssistantApps,
    ) as AssistantAppsModule;
    await this._getCharacterListMetaImage(langCode, overwrite, assistantAppsModule);

    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: ICharacterEnhanced = this._itemDetailMap[mapKey];

      await this._generateCharacterMetaImage(langCode, overwrite, detailEnhanced);
      await this._generatePartnerMetaImage(langCode, overwrite, detailEnhanced);
    }
  };

  private _generateCharacterMetaImage = async (
    langCode: string,
    overwrite: boolean,
    detailEnhanced: ICharacterEnhanced,
  ) => {
    const outputFullPath = path.join(paths().destinationFolder, detailEnhanced.meta_image_url);
    const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
    if (exists) return;

    const extraData = await getCharacterMetaImage(
      langCode,
      detailEnhanced.name_localised,
      detailEnhanced.portraits[0],
      detailEnhanced.partner_signature_species_tape_sticker_texture,
    );
    const template = getHandlebar().getCompiledTemplate<unknown>(
      handlebarTemplate.characterMetaImage,
      { ...site, data: detailEnhanced, ...extraData } as any,
    );

    generateMetaImage({ overwrite, template, langCode, outputFullPath });
  };

  private _getCharacterListMetaImage = async (
    langCode: string,
    overwrite: boolean,
    assistantAppsModule: AssistantAppsModule,
  ) => {
    const outputFile = `/assets/img/meta/${langCode}${routes.characters}-meta.png`;
    const outputFullPath = path.join(paths().destinationFolder, outputFile);
    const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
    if (exists) return;

    const characters = [
      this._itemDetailMap['kayleigh'],
      this._itemDetailMap['dog'],
      this._itemDetailMap['eugene'],
    ];

    const extraData = await getCharacterListMetaImage(characters.map((m) => m.portraits[0]));
    const forLocale = assistantAppsModule.getUITranslations(langCode);
    const title = forLocale['characters'];
    const template = getHandlebar().getCompiledTemplate<unknown>(
      handlebarTemplate.characterListMetaImage,
      { ...extraData, title },
    );

    generateMetaImage({ overwrite, template, langCode, outputFullPath });
  };

  private _generatePartnerMetaImage = async (
    langCode: string,
    overwrite: boolean,
    detailEnhanced: ICharacterEnhanced,
  ) => {
    const outputFullPath = path.join(paths().destinationFolder, detailEnhanced.partner_image_url);
    const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
    if (exists) return;

    const monster = detailEnhanced.partner_signature_species_monsters as IMonsterFormSimplified;
    const overrideElement = detailEnhanced.partner_signature_species_type_override_element;
    const isBootleg = overrideElement?.icon?.path != null;
    let elementPath = detailEnhanced.partner_signature_species_elemental_types_elements;
    if (isBootleg) elementPath = overrideElement?.icon?.path ?? '';

    const extraData = await getCharacterPartnerTapeImage(
      detailEnhanced.partner_signature_species_tape_sticker_texture,
      elementPath,
      isBootleg,
    );
    const template = getHandlebar().getCompiledTemplate<unknown>(
      handlebarTemplate.characterMonsterTape,
      { data: monster, ...extraData } as any,
    );

    generateMetaImage({ overwrite, template, langCode, outputFullPath });
  };
}
