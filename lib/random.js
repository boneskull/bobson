import _ from 'lodash/fp';
import Random from 'random-js';
import Stochator from 'stochator';

import {
  CONSONANTS, consonantWeights, isVowel, VOWELS, vowelWeights
} from './letters';

const engine = Random.engines.mt19937()
  .autoSeed();

const prng = Random.real(0, 1, false)
  .bind(null, engine);

// fits weights into normal distribution
function fitWeights (weights) {
  const sum = _.sum(weights);
  return _.map(w => w / sum, weights);
}

function randomVowel () {
  return Stochator.weightedRandomSetMember(VOWELS,
    fitWeights(vowelWeights),
    prng);
}

function randomConsonant () {
  return Stochator.weightedRandomSetMember(CONSONANTS,
    fitWeights(consonantWeights),
    prng);
}

function randomReplacementLetter (word, idx) {
  const char = word[idx];
  if (isVowel(char)) {
    return randomVowel();
  }
  return randomConsonant();
}

function randomWordIndex (word) {
  let idx;
  do {
    idx = Stochator.randomInteger(0, word.length - 1, prng);
  } while (/\W/.test(word[idx]));
  return idx;
}

function pickItem (items) {
  return Stochator.randomSetMember(items, prng);
}

const pickWeightedItem = _.curry((weights,
  items) => Stochator.weightedRandomSetMember(items, weights, prng));

function itemChooser (values) {
  return new Stochator({
    kind: 'set',
    values,
    replacement: false
  });
}

function weightedItemChooser (weights, values) {
  return new Stochator({
    kind: 'set',
    values,
    weights,
    replacement: false
  });
}

function randomInteger (min, max) {
  return Stochator.randomInteger(min, max, prng);
}

function randomFloat (min, max) {
  return Stochator.randomFloat(min, max, prng);
}

export {
  randomVowel,
  randomConsonant,
  randomReplacementLetter,
  randomWordIndex,
  pickItem,
  pickWeightedItem,
  itemChooser,
  weightedItemChooser,
  randomInteger,
  randomFloat
};
