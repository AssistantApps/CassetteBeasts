import path from 'path';
import { execFile } from 'node:child_process'; //get child_process module

import { paths } from 'constant/paths';

export interface IFrameInstructions {
  path: string;
  opts: string;
}

interface IAnimateWebpPromiseProps {
  frameInstructions: Array<IFrameInstructions>;
  outputFilePath: string;
  loopNum?: number;
  bgColour?: string; // A, R, G, B - e.g 255,255,255,255
}
export const animateWebp = (props: IAnimateWebpPromiseProps): Promise<string> => {
  return new Promise((resolve, reject) => {
    const queryOpts = [];
    for (const frameInstruction of props.frameInstructions) {
      queryOpts.push('-frame');
      queryOpts.push(frameInstruction.path);
      queryOpts.push(frameInstruction.opts);
    }
    queryOpts.push('-loop');
    queryOpts.push(props.loopNum ?? 0);
    queryOpts.push('-bgcolor');
    queryOpts.push(props.bgColour ?? '0,0,0,0');
    queryOpts.push('-o');
    queryOpts.push(props.outputFilePath);

    // TODO handle other OS versions

    execFile(
      path.join(paths().libFolder, 'webpmux.exe'), //
      queryOpts,
      (error, _, __) => {
        if (error) {
          reject(error);
        } else {
          resolve('100');
        }
      },
    );
  });
};
