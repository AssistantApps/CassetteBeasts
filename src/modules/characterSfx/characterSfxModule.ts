import fs from 'fs';
import path from 'path';

import { IntermediateFile } from 'constant/intermediateFile';
import { ModuleType } from 'constant/module';
import { paths } from 'constant/paths';
import type {
  ICharacter,
  ICharacterSfx,
  ICharacterSfxFile,
  ICharacterSfxFiles,
} from 'contracts/character';
import type { IExternalResource } from 'contracts/externalResource';
import { scaffoldFolderAndDelFileIfOverwrite } from 'helpers/fileHelper';
import { FolderPathHelper } from 'helpers/folderPathHelper';
import { pad } from 'helpers/stringHelper';
import { copyWavFile } from 'helpers/wavHelper';
import { readItemDetail } from 'modules/baseModule';
import { CommonModule } from 'modules/commonModule';
import { characterSfxMapFromDetailList } from './characterSfxMapFromDetailList';

export class CharacterSfxModule extends CommonModule<ICharacterSfx, ICharacterSfx> {
  private _folder = FolderPathHelper.characterSfx();

  constructor() {
    super({
      type: ModuleType.CharacterSfx,
      intermediateFile: IntermediateFile.characterSfx,
      dependsOn: [ModuleType.Characters],
    });
  }

  init = async () => {
    if (this.isReady) return;
    const list = fs.readdirSync(this._folder);

    for (const file of list) {
      const detail = await readItemDetail({
        fileName: file,
        folder: this._folder,
        mapFromDetailList: characterSfxMapFromDetailList(file.replace('_sfx.tres', '')),
      });
      this._baseDetails.push(detail);
    }

    return `${pad(this._baseDetails.length, 3, ' ')} character sfx`;
  };

  enrichData = async (langCode: string, modules: Array<CommonModule<unknown, unknown>>) => {
    const characterModule = this.getModuleOfType<ICharacter>(modules, ModuleType.Characters);
    for (const detail of this._baseDetails) {
      const mapKey = detail.file.toLowerCase();

      const characterData = characterModule.get(mapKey);
      if (characterData == null) continue;

      const audioFiles: Array<ICharacterSfxFiles> = [];
      for (const charSfxProp of Object.keys(detail)) {
        const charSfxValue = (detail as Record<string, any>)[charSfxProp];
        if (charSfxProp == 'audioFiles') continue;
        if (Array.isArray(charSfxValue) != true) continue;

        const outputFiles: Array<ICharacterSfxFile> = [];
        for (const extResource of charSfxValue as Array<IExternalResource>) {
          const outputFile = extResource.path.replace('res://sfx/', '/assets/audio/');
          outputFiles.push({
            url: outputFile,
            autoplay: outputFile.includes('recording_success'),
          });
        }

        if (outputFiles.length < 1) continue;
        audioFiles.push({ name: charSfxProp.replace('_', ' '), files: outputFiles });
      }

      detail.audioFiles = audioFiles;
      this._itemDetailMap[mapKey] = detail;
    }
    this.isReady = true;
  };

  copyWav = async (overwrite: boolean) => {
    for (const mapKey of Object.keys(this._itemDetailMap)) {
      const detailEnhanced: ICharacterSfx = this._itemDetailMap[mapKey];

      for (const sfxArray of detailEnhanced.audioFiles) {
        if (sfxArray == null) continue;

        for (const sfx of sfxArray.files) {
          if (sfx == null) continue;

          const outputFullPath = path.join(
            paths().destinationFolder,
            (sfx?.url ?? '').replace('res://sfx/', '/assets/audio/'),
          );
          const exists = scaffoldFolderAndDelFileIfOverwrite(outputFullPath, overwrite);
          if (exists) break;

          copyWavFile(sfx.url, outputFullPath);
        }
      }
    }
  };
}
