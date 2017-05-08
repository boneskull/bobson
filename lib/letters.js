'use strict';

const {vowelWeights, consonantWeights} = require('../data/weights.json');

const VOWELS_STRING = 'AEIOU';
const VOWELS = VOWELS_STRING.split('');
const CONSONANTS_STRING = 'BCDFGHJKLMNPQRSTVWXYZ';
const CONSONANTS = CONSONANTS_STRING.split('');

module.exports = {
  vowelWeights,
  consonantWeights,
  VOWELS,
  VOWELS_STRING,
  CONSONANTS,
  CONSONANTS_STRING,
  isVowel (c) {
    return new RegExp(`^[${VOWELS_STRING}]$`).test(c);
  },
  isConsonant (c) {
    return new RegExp(`^[${CONSONANTS_STRING}]$`).test(c);
  }
};
