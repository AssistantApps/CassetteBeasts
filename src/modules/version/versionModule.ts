import fs from 'fs';
import path from 'path';

import { IntermediateFile } from 'constant/intermediateFile';
import { ModuleType } from 'constant/module';
import { IVersion } from 'contracts/version';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { getConfig } from 'services/internal/configService';
import { VersionMapFromDetailList } from './versionMapFromDetailList';
import { paths } from 'constant/paths';

export class VersionModule extends CommonModule<IVersion> {
  private _fileName = 'version.tres';
  constructor() {
    super({
      type: ModuleType.Version,
      intermediateFile: IntermediateFile.version,
      dependsOn: [],
    });
  }

  init = async () => {
    if (this.isReady) return;
    this._itemDetailMap[this._fileName] = await readItemDetail({
      fileName: this._fileName,
      folder: path.join(getConfig().getUnpackedDir(), 'res'),
      mapFromDetailList: VersionMapFromDetailList,
    });
    this.isReady = true;
    return `Version details\n`;
  };

  get = (_: string) => this._itemDetailMap[this._fileName];

  initFromIntermediate = async () => {
    const srcFile = path.join(paths().intermediateFolder, this.intermediateFile);
    const jsonString = fs.readFileSync(srcFile, 'utf-8');
    this._itemDetailMap[this._fileName] = JSON.parse(jsonString);
  };

  writeIntermediate = () => {
    const destFile = path.join(paths().intermediateFolder, this.intermediateFile);
    fs.writeFileSync(destFile, JSON.stringify(this._itemDetailMap[this._fileName], null, 2));
  };
}
