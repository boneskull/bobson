import {format, parse, resolve} from 'path';
import {accessSync, constants as fsConstants, statSync} from 'fs';
import {constants as osConstants} from 'os';
import {readline$, writeJSON$} from '../util';
import {analyze$} from '../training';
import {stripIndents, oneLineTrim} from 'common-tags';
import d from 'debug';

const debug = d('bobsonbot:commands:train');

export const command = 'train <input>';

export const description = stripIndents`
  Train list of names.

  <input> must be a path to a text file containing names, one word per line.
  `;

export const builder = yargs => yargs.option('output', {
  alias: 'o',
  desc: oneLineTrim`
  Output to file instead of STDOUT. If a directory, will output 
  <basename>.stats.json given <basename>.txt as input.
  `,
  type: 'string',
  normalize: true
})
  .normalize('input')
  .check(argv => {
    const {input} = argv;
    if (!statSync(input).isFile()) {
      throw new Error(`${input} must exist and be a regular file`);
    }
    try {
      accessSync(input, fsConstants.R_OK);
    } catch (ignored) {
      throw new Error(`cannot read ${input}`);
    }
    if (argv.output) {
      const {output} = argv;
      let stats;
      try {
        stats = statSync(output);
        if (stats.isDirectory()) {
          const pathObj = parse(input);
          delete pathObj.base;
          pathObj.name = `${pathObj.name}.stats`;
          pathObj.ext = '.json';
          pathObj.dir = resolve(process.cwd(), output);
          argv.output = format(pathObj);
          debug(`will write to ${argv.output}`);
        }
      } catch (err) {
        if (err.errno !== osConstants.errno.ENOENT) {
          throw err;
        }
        debug(err);
      }
    }
    return true;
  }, false);

export const handler = ({output, input} = {}) => {
  readline$(input)
    .pipe(analyze$)
    .subscribe(result => {
      if (output) {
        writeJSON$(output, result).subscribe(() => {
          console.error(`wrote training data to ${output}`);
        });
      } else {
        console.log(JSON.stringify(result));
      }
    });
};
