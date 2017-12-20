import _ from 'lodash/fp';
import stats from 'statistics';
import {wordScore} from './filters';

const TUPLE = 2;
const TRIPLE = 3;

const increment = _.curry((key, obj, chars) => {
  const keypath = _.join('.', chars);
  return _.assign(obj, {
    [key]: _.set(keypath, _.getOr(0, keypath, obj[key]) + 1, obj[key])
  });
});

const incrementTuple = increment('tuples');
const incrementTriple = increment('triples');
const isTuple = _.pipe(_.size, _.eq(TUPLE));
const isTriple = _.pipe(_.size, _.eq(TRIPLE));
const getTuple = _.slice(_, TUPLE);
const getTriple = _.slice(_, TRIPLE);

export const analyzeWord = (freqs, word) => {
  const chars = word.trim()
    .split('');
  const range = _.range(0, chars.length);
  return _.reduce((acc, offset) => {
    const tuple = getTuple(offset, chars);
    if (isTuple(tuple)) {
      acc = incrementTuple(acc, tuple);
      const triple = getTriple(offset, chars);
      if (isTriple(triple)) {
        acc = incrementTriple(acc, triple);
      }
    }
    return acc;
  }, freqs, range);
};

export const analyze$ = source$ => source$.map(_.toLower)
  .reduce((acc, word) => {
    const frequencies = analyzeWord(acc.frequencies, word);
    const keypath = `words.${word.length}`;
    const wordsForLength = _.concat(_.getOr([], keypath, acc), word);
    return _.set(keypath, wordsForLength, _.assign(acc, {frequencies}));
  }, {
    frequencies: {
      tuples: {},
      triples: {}
    },
    scores: {},
    words: {}
  })
  .map(
    data => _.toPairs(data.words).reduce((acc, [len, words]) => _.assign(acc, {
      scores: _.assign(acc.scores, {
        [len]: words.map(word => wordScore(data.frequencies, word))
          .reduce(stats, null)
      })
    }), data))
  .map(_.omit('words'));
