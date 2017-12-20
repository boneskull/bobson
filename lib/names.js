import * as random from './random';
import {readline$} from './util';
import {join} from 'path';

export class Names {
  constructor (basename, dataDirPath = join(__dirname, '..', 'data')) {
    this.namesFilePath = join(dataDirPath, `${basename}.txt`);
    this.statsFilePath = join(dataDirPath, `${basename}.stats.json`);
  }

  async pick () {
    if (this.names) {
      return random.pickItem(this.names);
    }

    return readline$(this.namesFilePath)
      .toArray()
      .toPromise()
      .then(names => {
        this.names = names;
        return this.pick();
      });
  }
}
