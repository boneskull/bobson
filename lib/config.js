/* eslint-disable camelcase */
import {default as dotenv} from 'dotenv';

dotenv.config();

export const consumer_key = process.env.CONSUMER_KEY;
export const consumer_secret = process.env.CONSUMER_SECRET;
export const access_token = process.env.ACCESS_TOKEN;
export const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
