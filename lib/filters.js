import _ from 'lodash/fp';
import d from 'debug';

const DBL_CONSONANT_BLACKLIST = 'CHJKQVWXYZ';

const debug = d('bobsonbot:filters');

const doubleConsonantRegex = new RegExp(`([${DBL_CONSONANT_BLACKLIST}])\\1`);

const noDoublesAtStart = word => !(word.slice(0, 2) !== 'AA' &&
  /^([\w])\1/.test(word));

const noDoubleConsonants = word => !doubleConsonantRegex.test(word);

const wordScore = ({tuples, triples}, word) => {
  let scores = [];
  word = word.toLowerCase();
  switch (word.length) {
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
  // let i = scores.length;
  // while (i--) {
  //   if (scores[i] < 0.002) {
  //     return 0;
  //   }
  // }

  return _.mean(scores);
};

const isPronounceable = _.curry((statMap, word) => {
  // fix irishify and scottishify
  word = word.replace("'", '')
    .replace('c', 'C');
  const stats = statMap[word.length];
  const score = wordScore(word);
  debug(`${word} word score: ${score}`);
  return !stats || (noDoubleConsonants(word) && noDoublesAtStart(word) &&
    ((stats.mean - (2 * stats.stdev) >= 0 && score >= stats.mean -
      (2 * stats.stdev)) || score > 0.001));
});

export {
  noDoublesAtStart, noDoubleConsonants, wordScore, isPronounceable
};
