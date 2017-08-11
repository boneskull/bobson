/* eslint-disable strict */
'use strict';

/**
 * This will gather mean & standard deviation from the wordlists, grouped
 * by length.
 */

const stats = require('statistics');
const _ = require('lodash/fp');
const {join} = require('path');
const {wordScore} = require('../lib/filters');
const {lineObservable, writeJSON} = require('../lib/util');

const DATA_DIR = join(__dirname, '..', 'data');

async function readStats (filename) {
  return lineObservable(join(DATA_DIR, filename))
    .groupBy(_.size)
    .mergeMap(words => words.map(wordScore)
      .toArray()
      .filter(_.pipe(_.size, _.gt(_, 1)))
      .map(scores => scores.reduce(stats))
      .map(_.concat(String(words.key))))
    .toArray()
    .map(_.fromPairs)
    .toPromise();
}

Promise.all([
  readStats('firstnames.txt')
    .then(writeJSON(join(DATA_DIR, 'firstnames.json'))),
  readStats('surnames.txt')
    .then(writeJSON(join(DATA_DIR, 'surnames.json')))
])
  .then(() => {
    console.log('Done');
  });
