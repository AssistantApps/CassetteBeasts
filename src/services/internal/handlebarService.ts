import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { Container, Service } from 'typedi';

import { paths } from 'constant/paths';
import type { PageData } from 'contracts/pageData';
import { createFoldersOfDestFilePath, getIndexOfFolderSlash } from 'helpers/fileHelper';

interface IProps<T> {
  data: PageData<T>;
  templateFile: string;
  outputFiles?: Array<string>;
}

@Service()
export class HandlebarService {
  private _generatedFiles: Record<string, string> = {};
  private _registeredPartials: Array<string> = [];
  private _registeredHelpers: Array<string> = [];
  private _allowedTemplatesToCompile: Array<string> = [];

  init = () => {
    this.registerPartialsAndHelpers();
  };

  registerPartialsAndHelpers = () => {
    forEachFileInDirRecursive(
      path.join(paths().templatesFolder, 'helpers'),
      (fileName: string, filePath: string) => {
        if (!fileName.endsWith('.js')) return;
        const name = fileName.replace('.helper.js', '');
        Handlebars.registerHelper(name, require(filePath));
        this._registeredHelpers.push(name);
      },
    );

    const registerPartialsForFolder = (folder: string) => {
      forEachFileInDirRecursive(
        path.join(paths().templatesFolder, folder),
        (fileName: string, filePath: string) => {
          if (!fileName.endsWith('.hbs')) return;
          const name = `${folder}/${fileName.replace('.hbs', '')}`;
          Handlebars.registerPartial(name, fs.readFileSync(filePath, 'utf-8'));
          this._registeredPartials.push(name);
        },
      );
    };

    registerPartialsForFolder('layouts');
    registerPartialsForFolder('partials');
    registerPartialsForFolder('pages');
  };

  unregisterPartialsAndHelpers = () => {
    for (const helper of this._registeredHelpers) {
      Handlebars.unregisterHelper(helper);
    }
    for (const partial of this._registeredPartials) {
      Handlebars.unregisterPartial(partial);
    }
    this._registeredHelpers = [];
    this._registeredPartials = [];
  };

  getCompiledTemplate = <T>(templateFile: string, data: T) => {
    const templateFullFilePath = path.join(paths().templatesFolder, templateFile);
    const templateContent = fs.readFileSync(templateFullFilePath, 'utf8');
    const templateFunc = Handlebars.compile(templateContent);
    const compiledTemplate = templateFunc(data);

    return compiledTemplate;
  };

  compileTemplateToFile = async <T>(props: IProps<T>) => {
    // console.log('all', this._allowedTemplatesToCompile.join(', '));
    // console.log('cur', props.templateFile);
    // console.log('isMatch', this._allowedTemplatesToCompile.includes(props.templateFile));
    if (this._allowedTemplatesToCompile.length > 0) {
      if (this._allowedTemplatesToCompile.includes(props.templateFile.trim()) == false) {
        // console.error(
        //   `Template file '${props.templateFile}' is not in list of allowed template files.`,
        // );
        return;
      } else {
        console.log(`Generating files from template '${props.templateFile}'.`);
      }
    }

    const actualOutputFiles = props.outputFiles ?? [props.templateFile.replace('.hbs', '.html')];
    try {
      const compiledTemplate = this.getCompiledTemplate(props.templateFile, props.data);

      for (const actualOutputFile of actualOutputFiles) {
        this._generatedFiles[actualOutputFile] = actualOutputFile;
        const destFullFilePath = path.join(paths().destinationFolder, actualOutputFile);
        createFoldersOfDestFilePath(destFullFilePath);
        fs.writeFileSync(destFullFilePath, compiledTemplate, 'utf8');
      }
    } catch (e) {
      console.error(`Failed to generate template '${actualOutputFiles.join()}'`, e);
    }
  };
  getAllowedTemplatesToCompile = () => this._allowedTemplatesToCompile;
  setAllowedTemplatesToCompile = (allowedFiles: Array<string>) =>
    (this._allowedTemplatesToCompile = allowedFiles);

  clearGitIgnore = () => {
    this._generatedFiles = {};
  };
  generateGitIgnore = () => {
    try {
      const destFullFilePath = path.join(paths().destinationFolder, '.gitignore');
      createFoldersOfDestFilePath(destFullFilePath);
      const gitIgnoreFiles: Record<string, string> = {};
      for (const objKey of Object.keys(this._generatedFiles)) {
        if (objKey.includes('scss')) continue;
        const indexOfSlash = getIndexOfFolderSlash(objKey);
        if (indexOfSlash < 1) {
          gitIgnoreFiles[objKey] = objKey;
        } else {
          const folder = objKey.substring(0, indexOfSlash);
          gitIgnoreFiles[folder] = folder;
        }
      }
      fs.writeFileSync(
        destFullFilePath,
        Object.keys(gitIgnoreFiles)
          .map((f) => `/${f}`.replace('//', '/'))
          .join('\n'),
        'utf8',
      );
    } catch (e) {
      console.error(`Failed to generate .gitignore`, e);
    }
  };
}

export const forEachFileInDirRecursive = (
  dir: string,
  onFile: (fileName: string, filePath: string) => void,
) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullFilePath = path.join(dir, file);
    if (fs.lstatSync(fullFilePath).isDirectory()) {
      forEachFileInDirRecursive(fullFilePath, (fileName: string, filePath: string) =>
        onFile(`${file}/${fileName}`, filePath),
      );
    }

    onFile(file, fullFilePath);
  }
};

export const getHandlebar = () => Container.get(HandlebarService);
