import _ from 'lodash/fp';
import {Observable} from 'rxjs/Rx';
import fs from 'fs';
import rl from 'readline';

const writeFile = Observable.bindNodeCallback(fs.writeFile);

/**
 * Returns an Observable which emits each line of a file.
 * @param {string} filepath - Path to file
 * @returns {Observable<string>} Observable emitting each line
 */
export const readline$ = filepath => Observable.create(observer => {
  const stream = fs.createReadStream(filepath, 'utf8');

  rl.createInterface(stream)
    .on('error', err => {
      observer.error(err);
    })
    .on('line', line => {
      observer.next(line);
    })
    .on('close', () => {
      observer.complete();
    });
});

export const writeJSON$ = _.curry((filepath, value) => writeFile(filepath,
  JSON.stringify(value)));
