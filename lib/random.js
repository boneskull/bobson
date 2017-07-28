'use strict';

const _ = require('lodash/fp');
const Random = require('random-js');
const Stochator = require('stochator');
const {isVowel, CONSONANTS, VOWELS, vowelWeights, consonantWeights} = require(
  './letters');

const engine = Random.engines.mt19937()
  .autoSeed();

const prng = Random.real(0, 1, false)
  .bind(null, engine);

// fits weights into normal distribution
function fitWeights (weights) {
  const sum = _.sum(weights);
  return _.map(w => w / sum, weights);
}

const random = {
  randomVowel () {
    return Stochator.weightedRandomSetMember(VOWELS, fitWeights(vowelWeights),
      prng);
  },
  randomConsonant () {
    return Stochator.weightedRandomSetMember(CONSONANTS,
      fitWeights(consonantWeights), prng);
  },
  randomReplacementLetter (word, idx) {
    const char = word[idx];
    if (isVowel(char)) {
      return random.randomVowel();
    }
    return random.randomConsonant();
  },
  randomWordIndex (word) {
    let idx;
    do {
      idx = Stochator.randomInteger(0, word.length - 1, prng);
    } while (/\W/.test(word[idx]));
    return idx;
  },
  pickItem (items) {
    return Stochator.randomSetMember(items, prng);
  },
  pickWeightedItem: _.curry(
    (weights, items) => Stochator.weightedRandomSetMember(items, weights,
      prng)),
  itemChooser (values) {
    return new Stochator({
      kind: 'set',
      values,
      replacement: false
    });
  },
  weightedItemChooser (weights, values) {
    return new Stochator({
      kind: 'set',
      values,
      weights,
      replacement: false
    });
  },
  randomInteger (min, max) {
    return Stochator.randomInteger(min, max, prng);
  },
  randomFloat (min, max) {
    return Stochator.randomFloat(min, max, prng);
  }
};

module.exports = random;
