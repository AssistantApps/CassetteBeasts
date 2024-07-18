import fs from 'fs';

import { IntermediateFile } from 'constant/intermediateFile';
import { ModuleType } from 'constant/module';
import { ISpriteAnim } from 'contracts/spriteAnim';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { spriteAnimMapFromDetailList } from '../../misc/spriteAnimMapFromDetailList';

export class FusionSpriteAnimModule extends CommonModule<ISpriteAnim> {
  private _folders = fs
    .readdirSync(FolderPathHelper.fusionSpriteAnim())
    .map(FolderPathHelper.fusionSpriteAnimSubFolder);

  constructor() {
    super({
      type: ModuleType.FusionSpriteAnim,
      intermediateFile: IntermediateFile.fusionSpriteAnim,
      dependsOn: [],
    });
  }

  init = async () => {
    if (this.isReady) return;

    for (const folder of this._folders) {
      const list = fs.readdirSync(folder);

      for (const file of list) {
        if (!file.endsWith('.txt')) continue;

        const detail = await readItemDetail({
          fileName: file,
          folder: folder,
          mapFromDetailList: spriteAnimMapFromDetailList(file.replace('.txt', '')),
        });
        this._baseDetails.push(detail);
        this._itemDetailMap[detail.name] = detail;
      }
    }
    this.isReady = true;

    return `${this._baseDetails.length} fusion sprites`;
  };
}
