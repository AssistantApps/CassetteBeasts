import fs from 'fs';

import { IntermediateFile } from 'constants/intermediateFile';
import { ModuleType } from 'constants/module';
import type { IFusion, IFusionEnhanced } from 'contracts/fusion';
import { mapNodeResourceFromFlatMap } from 'contracts/mapper/nodeResourceMapper';
import type { INodeResource, INodeResourceEnhanced } from 'contracts/nodeResource';
import type { ISpriteAnim } from 'contracts/spriteAnim';
import { getAnimFileName, getFileFromFilePath } from 'helpers/fileHelper';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { copyImageFromRes, cutImageFromSpriteSheet } from 'helpers/imageHelper';
import { pad } from 'helpers/stringHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { LocalisationModule } from 'modules/localisation/localisationModule';
import { fusionMapFromDetailList } from './fusionMapFromDetailList';

export class FusionModule extends CommonModule<IFusion, IFusionEnhanced> {
  private _folder = FolderPathHelper.fusions();
  private _enhanced_nodes: Array<IFusionEnhanced> = [];

  constructor() {
    super({
      type: ModuleType.Fusion,
      intermediateFile: IntermediateFile.fusion,
      dependsOn: [ModuleType.Localisation, ModuleType.MonsterForms, ModuleType.FusionSpriteAnim],
    });
  }

  init = async () => {
    if (this.isReady) return;

    const list = fs.readdirSync(this._folder);

    for (const file of list) {
      const id = file.replace('.tscn', '');
      const detail = await readItemDetail({
        fileName: file,
        folder: this._folder,
        mapFromDetailList: fusionMapFromDetailList(id),
      });
      this._baseDetails.push(detail);
    }

    return `${pad(this._baseDetails.length, 3, ' ')} fusions`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    this._enhanced_nodes = [];
    for (const detail of this._baseDetails) {
      const nodes_enhanced: Record<string, INodeResourceEnhanced> = {};
      const detailNodes = detail.nodes ?? {};
      for (const mapKey of Object.keys(detailNodes)) {
        const node: INodeResource = detailNodes[mapKey];
        const instance_external_path = node.instance_external?.path ?? '';

        const node_enhanced: INodeResourceEnhanced = {
          ...node,
          instance_external_path,
        };
        nodes_enhanced[mapKey] = node_enhanced;
      }

      const sorted_nodes_enhanced = mapNodeResourceFromFlatMap(nodes_enhanced);
      const detailEnhanced: IFusionEnhanced = {
        ...detail,
        nodes: undefined,
        nodes_enhanced: sorted_nodes_enhanced,
      };
      this._itemDetailMap[detail.id] = detailEnhanced;
      this._enhanced_nodes.push(detailEnhanced);
    }
    this.isReady = true;
  };

  getImagesFromGameFiles = async (overwrite: boolean) => {
    for (const detail of this._enhanced_nodes) {
      for (const mapKey of Object.keys(detail.nodes_enhanced)) {
        const node: INodeResourceEnhanced = detail.nodes_enhanced[mapKey];
        await this._getNodeImagesFromGameFiles(overwrite, node);
      }
    }
  };

  generateImages = async (overwrite: boolean, modules: Array<CommonModule<unknown, unknown>>) => {
    const spriteAnimModule = this.getModuleOfType<ISpriteAnim>(
      modules,
      ModuleType.FusionSpriteAnim,
    );

    for (const detail of this._enhanced_nodes) {
      for (const mapKey of Object.keys(detail.nodes_enhanced)) {
        const node: INodeResourceEnhanced = detail.nodes_enhanced[mapKey];
        await this._generateNodeImages(overwrite, spriteAnimModule, node);
      }
    }
  };

  generateMetaImages = async (
    langCode: string,
    localeModule: LocalisationModule,
    overwrite: boolean,
  ) => {};

  // writePages = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
  //   const localeModule = this.getModuleOfType<ILocalisation>(
  //     modules,
  //     ModuleType.Localisation,
  //   ) as LocalisationModule;
  //   const language = localeModule.getTranslationMapForLocal(langCode).messages;
  //   const monsterModule = this.getModuleOfType<IMonsterForm>(modules, ModuleType.MonsterForms);

  //   const mainBreadcrumb = breadcrumb.fusion(langCode);

  //   // const monsterIdA = 'adeptile';
  //   // const monsterIdB = 'springheel';
  //   // const monsterA = monsterModule.get(monsterIdA);
  //   // const monsterB = monsterModule.get(monsterIdB);
  //   // const fusionKey = language[monsterA.fusion_name_prefix] + language[monsterB.fusion_name_suffix];

  //   // const monsterFusionA: IFusionEnhanced = this._itemDetailMap[monsterIdA];
  //   // const monsterFusionB: IFusionEnhanced = this._itemDetailMap[monsterIdB];
  //   // const fusion: Record<string, INodeResourceEnhanced> = { ...monsterFusionA.nodes_enhanced };
  //   // for (const bKey of Object.keys(monsterFusionB)) {
  //   //   const monsterFusionBProp = monsterFusionB[bKey];
  //   // }

  //   const fusionJsonFile = `assets/json${routes.fusion}.json`;
  //   const destFusionJsonFile = path.join(paths().destinationFolder, fusionJsonFile);
  //   createFoldersOfDestFilePath(destFusionJsonFile);
  //   const list = Object.values(this._itemDetailMap).map((l: IFusionEnhanced) => ({
  //     ...l,
  //     nodes: l.nodes_enhanced,
  //   }));
  //   fs.writeFileSync(destFusionJsonFile, JSON.stringify(list, null, 2), 'utf-8');

  //   const relativePath = `${langCode}${routes.fusion}/index.html`;
  //   const detailPageData = this.getBasicPageData({
  //     langCode,
  //     modules,
  //     documentTitle: 'Fusion',
  //     breadcrumbs: [mainBreadcrumb, breadcrumb.fusion(langCode)],
  //     data: {},
  //     relativePath,
  //   });
  //   await getHandlebar().compileTemplateToFile({
  //     data: detailPageData,
  //     outputFiles: [relativePath],
  //     templateFile: handlebarTemplate.fusion,
  //   });

  //   // const list: Array<ICharacterEnhanced> = [];
  //   // for (const mapKey of Object.keys(this._itemDetailMap)) {
  //   //   const details: ICharacterEnhanced = this._itemDetailMap[mapKey];
  //   //   list.push(details);
  //   //   const relativePath = `${langCode}${routes.characters}/${encodeURI(mapKey)}.html`;
  //   //   const detailPageData = this.getBasicPageData({
  //   //     langCode,
  //   //     localeModule,
  //   //     documentTitle: details.name_localised,
  //   //     breadcrumbs: [mainBreadcrumb, breadcrumb.characterDetail(langCode, details.name_localised)],
  //   //     data: details,
  //   //     relativePath,
  //   //   });
  //   //   detailPageData.images.twitter = details.meta_image_url;
  //   //   detailPageData.images.facebook = details.meta_image_url;
  //   //   await getHandlebar().compileTemplateToFile({
  //   //     data: detailPageData,
  //   //     outputFiles: [relativePath],
  //   //     templateFile: handlebarTemplate.characterDetail,
  //   //   });
  //   // }
  //   // const relativePath = `${langCode}${routes.fusion}/index.html`;
  //   // const sortedList = list.sort(sortByStringProperty((l) => l.name_localised));
  //   // await getHandlebar().compileTemplateToFile({
  //   //   data: this.getBasicPageData({
  //   //     langCode,
  //   //     localeModule,
  //   //     documentTitleUiKey: mainBreadcrumb.uiKey,
  //   //     breadcrumbs: [mainBreadcrumb],
  //   //     data: { list: sortedList },
  //   //     relativePath,
  //   //   }),
  //   //   outputFiles: [relativePath],
  //   //   templateFile: handlebarTemplate.character,
  //   // });
  // };

  private _findMostCommonKeys = () => {
    const mapCount: Record<string, number> = {};
    for (const detail of this._baseDetails) {
      const detailNodes = detail.nodes ?? {};
      for (const nodeKey of Object.keys(detailNodes)) {
        const node: INodeResource = detailNodes[nodeKey];
        mapCount[node.name] = (mapCount[node.name] ?? 0) + 1;
      }
    }

    for (const nodeKey of Object.keys(mapCount)) {
      if (mapCount[nodeKey] < 10) continue;
      console.log(nodeKey, mapCount[nodeKey]);
    }

    // Arm_Back 136
    // Tail 140
    // FrontLeg_Back 141
    // BackLeg_Back 141
    // FrontLeg_Front 141
    // BackLeg_Front 141
    // Body 141
    // HelmetBack 141
    // empty_helmet 47
    // Head 141
    // HelmetFront 141
    // Arm_Front 136
    // attack 141
    // hit 128
    // Sprite 63
    // Sprite2 27
    // cloud_tail 10
    // simple5_leg_back 11
    // simple5_leg_front 11
    // eye 13
    // devil1_tail 10
    // simple3_leg_back 10
    // simple3_leg_front 10
    // short_tail 14
  };

  private _getNodeImagesFromGameFiles = async (overwrite: boolean, node: INodeResourceEnhanced) => {
    const icon_url = node.instance_external_path.replace('.json', '.png');
    if (icon_url != null && icon_url.length > 10) {
      await copyImageFromRes(overwrite, { id: 0, path: icon_url, type: '' });
    }

    if (node.child == null) return;
    for (const mapKey of Object.keys(node.child)) {
      const child = node.child[mapKey] as INodeResourceEnhanced;
      await this._getNodeImagesFromGameFiles(overwrite, child);
    }
  };

  private _generateNodeImages = async (
    overwrite: boolean,
    spriteAnimModule: CommonModule<ISpriteAnim, ISpriteAnim>,
    node: INodeResourceEnhanced,
  ) => {
    const icon_url = node.instance_external_path.replace('.json', '.png');
    const sprite_anim_key = getFileFromFilePath(node.instance_external_path).replace('.json', '');
    const animations = (spriteAnimModule.get(sprite_anim_key)?.animations ?? []).map((a, idx) => ({
      ...a,
      imageUrl: getAnimFileName(icon_url, idx),
    }));

    if (animations != null && animations.length > 0) {
      const firstFrame = animations[0].frames[0];
      await cutImageFromSpriteSheet({
        overwrite,
        spriteFilePath: icon_url,
        boxSelection: firstFrame,
      });
      // await createWebpFromISpriteAnim({
      //   overwrite,
      //   spriteFilePath: node.icon_url,
      //   animations: node.animations,
      // });
    }

    if (node.child == null) return;
    for (const mapKey of Object.keys(node.child)) {
      const child = node.child[mapKey] as INodeResourceEnhanced;
      await this._generateNodeImages(overwrite, spriteAnimModule, child);
    }
  };
}
