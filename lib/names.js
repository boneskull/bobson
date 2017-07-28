'use strict';

const path = require('path');
const {pickItem} = require('./random');
const {lineObservable} = require('./util');
const mutations = require('./mutations');
const random = require('./random');
const _ = require('lodash/fp');
const {isPronounceable} = require('./filters');
const stats = {
  surname: require('../data/surnames.json'),
  firstname: require('../data/firstnames.json')
};

class Name {
  constructor (firstname, surname) {
    surname = surname.replace(/^MC/, 'Mc');
    this.firstname = this.originalFirstname = firstname;
    this.surname = this.originalSurname = surname;
    this.applied = {
      firstname: [],
      surname: []
    };
    this.failures = [];
  }

  mutate (chance = 1) {
    const whichName = random.pickItem([
      'firstname',
      'surname'
    ]);
    const oldName = this[whichName];
    const allowedMutators = _.filter(
      ([mutatorName, mutator]) => mutator.allow.has(whichName) &&
        (!this.applied[whichName].length ||
          mutator.after.has(_.last(this.applied[whichName]))) &&
        mutator.test(oldName), _.entries(mutations));
    if (allowedMutators.length) {
      const [mutatorName, mutator] = random.pickWeightedItem(_.map(
        ([mutatorName, mutator]) => mutatorName === 'discombobulate'
          ? 3 / 4
          : 1 / 4 / (allowedMutators.length - 1), allowedMutators), allowedMutators);
      const newName = mutator(oldName);
      if (!isPronounceable(stats[whichName], newName)) {
        this.failures.push(newName);
        return this.mutate(chance);
      }
      this.applied[whichName].push(mutatorName);
      this[whichName] = newName;
      chance /= 1.25;
      if (random.randomFloat(0, 1) <= chance) {
        return this.mutate(mutator, chance);
      }
    }
    return this;
  }

  toString () {
    return `${this.firstname} ${this.surname}`;
  }
}

class Names {
  constructor (basename, dataDirPath = path.join(__dirname, '..', 'data')) {
    this.namesFilePath = path.join(dataDirPath, `${basename}.txt`);
    this.statsFilePath = path.join(dataDirPath, `${basename}.json`);
  }

  async pick () {
    if (this.names) {
      return pickItem(this.names);
    }

    return lineObservable(this.namesFilePath)
      .toArray()
      .toPromise()
      .then(names => {
        this.names = names;
        return this.pick();
      });
  }
}

module.exports = {
  Names,
  Name
};
