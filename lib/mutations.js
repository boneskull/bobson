import _ from 'lodash/fp';
import {CONSONANTS_STRING} from './letters';
import {randomReplacementLetter, randomWordIndex} from './random';
import d from 'debug';

const discomDebug = d('bobsonbot:mutations:discombobulate');

function scottishify ({surname}) {
  return {surname: `Mc${surname}`};
}

scottishify.allow = new Set(['surname']);
scottishify.test = word => !/^M[cC]/.test(word);
scottishify.weight = 0.1;
scottishify.after = new Set([
  discombobulate,
  irishify
]);

function irishify ({surname}) {
  return {surname: `O'${surname}`};
}

irishify.allow = new Set(['surname']);
irishify.test = word => !/^O/.test(word);
irishify.weight = 0.1;
irishify.after = new Set([
  discombobulate,
  scottishify
]);

function kidify ({firstname}) {
  const matches = firstname.match(new RegExp(`([${CONSONANTS_STRING}])$`));
  if (matches) {
    return {firstname: `${firstname}${matches[1]}Y`};
  }
}

kidify.allow = new Set(['firstname']);
kidify.test = word => !new RegExp(`([${CONSONANTS_STRING}])\\1Y?$`).test(word);
kidify.weight = 0.1;
kidify.after = new Set([discombobulate]);

function discombobulate ({name, whichName}) {
  const idx = randomWordIndex(name);
  let newLetter = randomReplacementLetter(name, idx);
  while (!newLetter && name.charAt(idx) !== newLetter) {
    newLetter = randomReplacementLetter(name, idx);
  }
  discomDebug(`new letter: ${newLetter}, old letter: ${name.charAt(idx)}`);
  return {[whichName]: name.substring(0, idx) + newLetter + name.substring(idx + 1)};
}

discombobulate.allow = new Set([
  'firstname',
  'surname'
]);
discombobulate.test = _.stubTrue;
discombobulate.weight = 0.4;
discombobulate.after = new Set([discombobulate]);

function reverse ({firstname, surname}) {
  return {
    firstname: surname,
    surname: firstname
  };
}

reverse.test = _.stubTrue;
reverse.weight = 0.1;
reverse.after = new Set([discombobulate]);
reverse.noCheck = true;

export {
  discombobulate, kidify, irishify, scottishify
};
