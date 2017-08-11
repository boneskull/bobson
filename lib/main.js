import Twit from 'twit';
import * as config from './config';
import {Name, Names} from './names';

const firstnames = new Names('firstnames');
const surnames = new Names('surnames');

export async function main (opts = {}) {
  const [firstname, surname] = await Promise.all([
    firstnames.pick(),
    surnames.pick()
  ]);
  const name = new Name(firstname, surname);
  const status = String(name.mutate());
  console.log(status);

  if (!opts.dryRun) {
    const T = new Twit(config);
    try {
      await T.post('statuses/update', {status});
      console.error('OK');
    } catch (e) {
      console.error(e);
    }
  }
}
