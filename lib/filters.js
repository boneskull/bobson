'use strict';

const _ = require('lodash/fp');
const DBL_CONSONANT_BLACKLIST = 'CHJKQVWXYZ';
const tuples = require('../data/letter-freq-tuples.json');
const triples = require('../data/letter-freq-triples.json');

const filters = {
  doublesAtStart (word) {
    return !(word.slice(0, 2) !== 'AA' && /^([\w])\1/.test(word));
  },
  doubleConsonants (word) {
    return !new RegExp(`([${DBL_CONSONANT_BLACKLIST}])\\1`).test(word);
  },
  wordScore (word) {
    const scores = [];
    word = word.toLowerCase();
    switch (word.length) {
      case 1:
        scores.push(1);
        break;
      case 2:
        for (let i = 0; i < word.length - 1; i++) {
          scores.push(_.getOr(0, `['${word[i]}']['${word[i + 1]}']`, tuples));
        }
        break;
      default:
        for (let i = 0; i < word.length - 2; i++) {
          scores.push(_.getOr(0,
            `['${word[i]}']['${word[i + 1]}']['${word[i + 2]}']`,
            triples));
        }
        break;
    }
    return _.mean(scores);
  },
  isPronounceable: _.curry((statMap, word) => {
    const stats = statMap[word.length];
    return !stats || filters.wordScore(word) > stats.mean - (2 * stats.stdev);
  })
};

module.exports = filters;
