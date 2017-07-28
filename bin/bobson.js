#!/usr/bin/env node
'use strict';

const {Names, Name} = require('../lib/names');
const Twit = require('twit');
const config = require('../lib/config');

const firstnames = new Names('firstnames');
const surnames = new Names('surnames');

(async function () {
  Promise.all([
    firstnames.pick(),
    surnames.pick()
  ])
    .then(([firstname, surname]) => {
      const name = new Name(firstname, surname);
      const status = String(name.mutate());
      console.log(status);

      const T = new Twit(config);
      return T.post('statuses/update', {status});
    })
    .then(() => {
      console.error('OK');
    });
}());
