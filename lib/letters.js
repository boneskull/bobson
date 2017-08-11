import weights from '../data/weights.json';

// weights @ http://www.cryptograms.org/letter-frequencies.php

const {vowelWeights, consonantWeights} = weights;
const VOWELS_STRING = 'AEIOU';
const VOWELS = VOWELS_STRING.split('');
const CONSONANTS_STRING = 'BCDFGHJKLMNPQRSTVWXYZ';
const CONSONANTS = CONSONANTS_STRING.split('');

function isVowel (c) {
  return new RegExp(`^[${VOWELS_STRING}]$`).test(c);
}

function isConsonant (c) {
  return new RegExp(`^[${CONSONANTS_STRING}]$`).test(c);
}

export {
  vowelWeights,
  consonantWeights,
  VOWELS,
  VOWELS_STRING,
  CONSONANTS,
  CONSONANTS_STRING,
  isVowel,
  isConsonant
};
