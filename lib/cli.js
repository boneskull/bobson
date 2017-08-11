import yargs from 'yargs';
import {main} from './main';

const argv = yargs.option('dry-run', {
  default: false,
  description: 'Do everything except post to Twitter'
})
  .help().argv;

main(argv);
