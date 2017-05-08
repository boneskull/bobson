const path = require('path');
const {pickItem} = require('./random');
const {lineObservable} = require('./util');
const mutations = require('./mutations');
const random = require('./random');
const _ = require('lodash/fp');

const mutationCount = _.pipe(_.keys, _.size)(mutations);

class Name {
  constructor (firstname, surname) {
    this.firstname = firstname;
    this.surname = surname;
  }

  mutate() {
    const numMutations = random.randomInteger(1, mutationCount - 1);
    const chooseMutation = random.itemChooser(_.keys(mutations));
    const mutationList = _.reduce(acc => acc.concat(chooseMutation.next()), [], _.range(0, numMutations));

    console.log(mutationList);

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

module.exports = {Names, Name};
