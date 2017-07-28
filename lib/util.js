'use strict';

const _ = require('lodash/fp');
const {Observable} = require('rxjs');
const fs = require('fs');
const readline = require('readline');

/**
 * Returns an Observable which emits each line of a file.
 * @param {string} filepath - Path to file
 * @returns {Observable}
 */
exports.lineObservable = function lineObservable (filepath) {
  return Observable.create(observer => {
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
};

exports.writeJSON = _.curry((filepath, value) => {
  fs.writeFileSync(filepath, JSON.stringify(value));
});
