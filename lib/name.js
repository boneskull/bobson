import * as mutations from './mutations';
import * as random from './random';
import _ from 'lodash/fp';
import {isPronounceable} from './filters';
import d from 'debug';

const debug = d('bobsonbot:name');

export class Name {
  constructor (firstname, surname) {
    surname = surname.replace(/^MC/, 'Mc');
    this.firstname = this.originalFirstname = firstname;
    this.surname = this.originalSurname = surname;
    this.applied = {
      firstname: [],
      surname: []
    };
    this.failed = [];
    debug(`initialized:\t${this.originalFirstname} ${this.originalSurname}`);
  }

  get successes () {
    return this.applied.firstname.length + this.applied.surname.length;
  }

  get attempts () {
    return this.successes + this.failed.length;
  }

  mutate (chance = 1) {
    const mDebug = d('bobsonbot:name:mutate');
    mDebug(`mutation attempt: ${this.attempts}`);
    const whichName = random.pickItem([
      'firstname', 'surname'
    ]);
    const name = this[whichName];
    const {firstname, surname} = this;
    mDebug(`attempting to mutate a "${whichName}"`);

    // this could be more concise and even less readable
    const allowedMutators = _.filter(([mutatorName, mutator]) => {
      let ok = mutator.allow.has(whichName);
      if (ok && this.applied[whichName].length) {
        const lastMutatorName = _.last(this.applied[whichName]).mutatorName;
        ok = mutator.after.has(mutations[lastMutatorName]);
      }
      if (ok && mutator.test(name)) {
        return true;
      }
      return false;
    }, _.entries(mutations));

    debug(`allowed mutations: ${allowedMutators.length}`);

    if (allowedMutators.length) {
      const [mutatorName, mutator] = random.pickWeightedItem(_.map(([mutatorName, mutator]) => mutatorName ===
        'discombobulate' ? 3 / 4 : 1 / 4 / (allowedMutators.length - 1),
        allowedMutators), allowedMutators);
      debug(`running ${mutatorName}`);
      const newNames = _.defaults({
        firstname: this.firstname,
        surname: this.surname
      }, mutator({
        name,
        firstname,
        surname,
        whichName
      }));

      if (!isPronounceable(stats[whichName], newNames[whichName])) {
        this.failed.push({
          firstname: newNames.firstname,
          surname: newNames.surname,
          mutatorName,
          whichName,
          reason: 'unpronounceable'
        });
        mDebug(`failed, unpronounceable: ${newNames.firstname} ${newNames.surname} (${whichName})`);
        return this.mutate(chance);
      }
      this[whichName] = newNames[whichName];
      this.firstname = newNames.firstname;
      this.surname = newNames.surname;
      this.applied[whichName].push({
        firstname: this.firstname,
        surname: this.surname,
        mutatorName
      });
      chance /= 1.25;
      if (random.randomFloat(0, 1) <= chance) {
        return this.mutate(chance);
      }
    } else if (!this.successes) {
      throw new Error(`no mutations allowed for ${this.firstname} ${this.surname}`);
    }
    return this;
  }

  toString () {
    return `${this.firstname} ${this.surname}`;
  }
}

