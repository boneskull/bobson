'use strict';

const fs = require('fs');
const path = require('path');
const split = require('split2');
const Random = require('random-js');
const pronounceable = require('pronounceable');

// http://deron.meranda.us/data/
const firstnameFreqs = require('./data/firstnames.json');
const surnameFreqs = require('./data/surnames.json');

const engine = Random.engines.mt19937()
  .autoSeed();

const VOWEL = /[AEIOU]/;

// https://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html
const LETTER_FREQ = {
  E: 1202,
  T: 910,
  A: 812,
  O: 768,
  I: 731,
  N: 695,
  S: 628,
  R: 602,
  H: 592,
  D: 432,
  L: 398,
  U: 288,
  C: 271,
  M: 261,
  F: 230,
  Y: 211,
  W: 209,
  G: 203,
  P: 182,
  B: 149,
  V: 111,
  K: 69,
  X: 17,
  Q: 11,
  J: 10,
  Z: 7
};

const consonants = [];
const vowels = [];
const letters = [];
for (let i = 65; i < 91; i++) {
  const char = String.fromCharCode(i);
  if (VOWEL.test(char)) {
    vowels.push(char);
  } else {
    consonants.push(char);
  }
}

function chooseNewLetter (alphabet) {
  const totalFreq = alphabet === vowels
    ? 3801
    : 6198;
  const num = Random.integer(0, totalFreq, false)(engine);
  let i = 0;
  let count;
  for (count = 0; i < alphabet.length; i++) {
    count += LETTER_FREQ[alphabet[i]];
    if (count >= num) {
      return alphabet[i];
    }
  }
  return alphabet[i];
}

function pick (filepath) {


  const items = [];


  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(split())
      .on('data', item => {
        items.push(item);
      })
      .on('end', () => {
        resolve(Random.pick(engine, items));
      })
      .on('error', reject);
  });
}

function mutate (name) {
  let newName;
  const originalScore = pronounceable.score(name);
  const handicap = originalScore < THRESHOLD
    ? THRESHOLD - originalScore
    : 0;
  const pct = originalScore > THRESHOLD
    ? (originalScore - THRESHOLD) / 0.01 * PCT
    : PCT;
  const minScore = originalScore + handicap -
    ((originalScore + handicap) * pct);
  let score;
  let tries = 0;
  console.error(`mutating ${name} (orig: ${originalScore.toPrecision(2)}, minScore: ${minScore.toPrecision(
    2)}, handicap: ${handicap.toPrecision(2)})`);
  do {
    if (tries) {
      console.error(`unpronounceable: ${newName} (${score})`);
      if (tries === 10) {
        return name;
      }
    }
    let idx;
    let alphabet;
    do {
      idx = Random.die(name.length)(engine) - 1;
    } while (!/\w/.test(name[idx]));
    alphabet = VOWEL.test(name[idx])
      ? vowels
      : consonants;
    let newLetter;
    do {
      newLetter = chooseNewLetter(alphabet);
    } while (newLetter === name[idx]);
    const nameArr = Array.prototype.slice.call(name);
    nameArr[idx] = newLetter;
    newName = nameArr.join('');
    tries++;
    score = pronounceable.score(newName) + handicap;
  } while (score < minScore);
  console.error(`ok: ${newName} (${score})`);
  return newName;

}

Promise.all([
  pick(path.join(__dirname, 'data', 'surnames.txt'))
    .then(mutate),
  pick(path.join(__dirname, 'data', 'firstnames.txt'))
    .then(mutate)
])
  .then(([lastName, firstName]) => {
    console.log(`${firstName} ${lastName}`);
  });


