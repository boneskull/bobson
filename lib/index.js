'use strict';

const {join} = require('path');
const {openFile} = require('./letters');
const generators = require('./random');

//
//Promise.all([
//  openFile(join(__dirname, '..', 'data', 'firstnames.txt'))
//    .then(generators.pickItem),
//  openFile(join(__dirname, '..', 'data', 'surnames.txt'))
//    .then(generators.pickItem)
//]).then(([firstname, lastname])=> {
//  console.log(`${firstname} ${lastname}`);
//});


openFile(join(__dirname, '..', 'data', 'firstnames.txt')).then(names => {
  return names.filter(name => name.length === 3);
}).then(names => {
  console.log(`${names.length} ${names[0].length}-length first names found`);
  const _ = require('lodash/fp')
  console.log(_.pipe(_.map(require('./filters').wordScore), require('median'))(names));
})
