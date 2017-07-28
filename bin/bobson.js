#!/usr/bin/env node
'use strict';

const {Names, Name} = require('../lib/names');

const firstnames = new Names('firstnames');
const surnames = new Names('surnames');

(async function () {
  Promise.all([
    firstnames.pick(),
    surnames.pick()
  ])
    .then(([firstname, surname]) => {
      const name = new Name(firstname, surname);
      console.log(String(name.mutate()));
    });
}());
