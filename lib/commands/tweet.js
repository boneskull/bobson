import Twit from 'twit';
import {generate} from '../generate';
import * as config from '../config';
import d from 'debug';

const debug = d('bobsonbot:commands:tweet');

export const command = 'tweet';
export const description = 'Tweet an unlikely ballplayer name';
export const builder = {
  'dry-run': {
    alias: 'D',
    default: false,
    description: 'Do everything except post to Twitter'
  }
};

export const handler = async (opts) => {
  const result = await generate();
  if (!opts.dryRun) {
    const T = new Twit(config);
    const tweet = await T.post('statuses/update', {status: result});
    debug(`tweeted: ${tweet}`);
  } else {
    debug('dry run complete');
  }
};
