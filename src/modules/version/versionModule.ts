import fs from 'fs';
import path from 'path';

import { IntermediateFile } from 'constants/intermediateFile';
import { ModuleType } from 'constants/module';
import { paths } from 'constants/paths';
import type { IVersion } from 'contracts/version';
import { pad } from 'helpers/stringHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { getConfig } from 'services/internal/configService';
import { VersionMapFromDetailList } from './versionMapFromDetailList';

export class VersionModule extends CommonModule<IVersion, IVersion> {
  private _fileName = 'version.tres';
  constructor() {
    super({
      type: ModuleType.Version,
      intermediateFile: IntermediateFile.version,
      loadOnce: true,
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
    return `${pad(1, 3, ' ')} version loaded (${this._itemDetailMap[this._fileName].commit_tag})`;
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

  updatePackageVersionNumber = () => {
    this._itemDetailMap[this._fileName].app_version = getConfig().packageVersion();
    this.writeIntermediate();
  };
}
