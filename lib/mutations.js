'use strict';

const {CONSONANTS_STRING} = require('./letters');
const {randomWordIndex, randomReplacementLetter} = require('./random');
const _ = require('lodash/fp');

function scottishify (word) {
  return `Mc${word}`;
}

scottishify.allow = new Set(['surname']);
scottishify.test = word => !/^M[cC]/.test(word);
scottishify.weight = 0.2;
scottishify.after = new Set([
  discombobulate,
  irishify
]);

function irishify (word) {
  return `O'${word}`;
}

irishify.allow = new Set(['surname']);
irishify.test = word => !/^O/.test(word);
irishify.weight = 0.2;
irishify.after = new Set([
  discombobulate,
  scottishify
]);

function kidify (word) {
  const matches = word.match(new RegExp(`([${CONSONANTS_STRING}])$`));
  if (matches) {
    return `${word}${matches[1]}Y`;
  }
  return word;
}

kidify.allow = new Set(['firstname']);
kidify.test = word => !new RegExp(`([${CONSONANTS_STRING}])\\1Y?$`).test(word);
kidify.weight = 0.2;
kidify.after = new Set([discombobulate]);

function discombobulate (word) {
  const idx = randomWordIndex(word);
  const newLetter = randomReplacementLetter(word, idx);
  if (!newLetter) {
    throw new Error(
      `couldn't get replacement letter for idx ${idx} in word ${word}`);
  }
  return word.substring(0, idx) + newLetter + word.substring(idx + 1);
}

discombobulate.allow = new Set([
  'firstname',
  'surname'
]);
discombobulate.test = _.stubTrue;
discombobulate.weight = 0.4;
discombobulate.after = new Set([discombobulate]);

module.exports = {
  discombobulate,
  kidify,
  irishify,
  scottishify
};
