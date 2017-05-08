'use strict';

const {CONSONANTS_STRING} = require('./letters');
const {randomWordIndex, randomReplacementLetter} = require('./random');

const mutations = {
  scottishify (word) {
    if (/^MC/.test(word)) {
      return word;
    }
    return `Mc${word}`;
  },
  irishify (word) {
    if (/^O/.test(word)) {
      return word;
    }
    return `O'${word}`;
  },
  kidify (word) {
    if (word.length > 4 ||
      new RegExp(`([${CONSONANTS_STRING}])\\1Y$`).test(word)) {
      return word;
    }
    const matches = word.match(new RegExp(`([${CONSONANTS_STRING}])$`));
    if (matches) {
      return `${word}${matches[1]}Y`;
    }
    return word;
  },
  discombobulate (word) {
    const idx = randomWordIndex(word);
    const newLetter = randomReplacementLetter(word, idx);
    return word.substring(0, idx) + newLetter + word.substring(idx + 1);
  }
};

module.exports = mutations;

