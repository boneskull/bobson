import yargs from 'yargs';
import {join} from 'path';

yargs.usage('$0 [command]')
  .commandDir(join(__dirname, 'commands'))
  .demandCommand(1, 1)
  .help().parse();
