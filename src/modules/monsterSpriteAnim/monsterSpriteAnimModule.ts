import fs from 'fs';

import { IntermediateFile } from 'constants/intermediateFile';
import { ModuleType } from 'constants/module';
import type { ISpriteAnim } from 'contracts/spriteAnim';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { pad } from 'helpers/stringHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { spriteAnimMapFromDetailList } from '../../misc/spriteAnimMapFromDetailList';

export class MonsterSpriteAnimModule extends CommonModule<ISpriteAnim, ISpriteAnim> {
  private _folder = FolderPathHelper.monsterSpriteAnim();
  // TODO get world sprites

  constructor() {
    super({
      type: ModuleType.MonsterSpriteAnim,
      intermediateFile: IntermediateFile.monsterSpriteAnim,
      dependsOn: [],
    });
  }

  init = async () => {
    if (this.isReady) return;
    const list = fs.readdirSync(this._folder);

    for (const file of list) {
      if (!file.endsWith('.txt')) continue;

      const detail = await readItemDetail({
        fileName: file,
        folder: this._folder,
        mapFromDetailList: spriteAnimMapFromDetailList(file.replace('.txt', '')),
      });
      this._baseDetails.push(detail);
      this._itemDetailMap[detail.name] = detail;
    }
    this.isReady = true;

    return `${pad(this._baseDetails.length, 3, ' ')} monster sprites`;
  };
}
