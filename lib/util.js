import _ from 'lodash/fp';
import Rx from 'rxjs/Rx';
import fs from 'fs';
import readline from 'readline';

/**
 * Returns an Observable which emits each line of a file.
 * @param {string} filepath - Path to file
 * @returns {Observable}
 */
export function lineObservable (filepath) {
  return Rx.Observable.create(observer => {
    const stream = fs.createReadStream(filepath, 'utf8');

    readline.createInterface(stream)
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
}

export const writejSON = _.curry((filepath, value) => {
  fs.writeFileSync(filepath, JSON.stringify(value));
});
