import {generate} from '../generate';

export const command = 'generate';
export const description = 'Generate an unlikely ballplayer name';

export const handler = async (opts) => {
  const result = await generate();
  console.log(result);
};
