'use strict';

const _ = require('lodash/fp');
const DBL_CONSONANT_BLACKLIST = 'CHJKQVWXYZ';
const tuples = require('../data/letter-freq-tuples.json');
const triples = require('../data/letter-freq-triples.json');

const filters = {
  noDoublesAtStart (word) {
    return !(word.slice(0, 2) !== 'AA' && /^([\w])\1/.test(word));
  },
  noDoubleConsonants (word) {
    return !new RegExp(`([${DBL_CONSONANT_BLACKLIST}])\\1`).test(word);
  },
  wordScore (word) {
    let scores = [];
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
          scores.push(
            _.getOr(0, `['${word[i]}']['${word[i + 1]}']['${word[i + 2]}']`,
              triples));
        }
        break;
    }
    let i = scores.length;
    while (i--) {
      if (scores[i] < 0.003) {
        return 0;
      }
    }
    return _.mean(scores);
  },
  isPronounceable: _.curry((statMap, word) => {
    // fix irishify and scottishify
    word = word.replace("'", '')
      .replace('c', 'C');
    const stats = statMap[word.length];
    const score = filters.wordScore(word);
    return !stats ||
      (filters.noDoubleConsonants(word) && filters.noDoublesAtStart(word) &&
        ((stats.mean - (2 * stats.stdev) >= 0 && score >= stats.mean -
          (2 * stats.stdev)) || score > 0.001));
  })
};

module.exports = filters;
