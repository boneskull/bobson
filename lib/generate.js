import {Name} from './name';
import {Names} from './names';

export const generate = async (fBasename = 'firstnames',
  sBasename = 'surnames') => {
  const firstnames = new Names(fBasename);
  const surnames = new Names(sBasename);
  const [firstname, surname] = await Promise.all([
    firstnames.pick(), surnames.pick()
  ]);
  const name = new Name(firstname, surname);
  return String(name.mutate());
};
