'use strict';

const _ = require('lodash');

const GSheet = require('../lib/gsheet');

describe('selector', () => {

  it('test', () => {
    const gsheet = new GSheet({sheetName: 'list'});
    let query = {};
    // query = {
    //   $and: [
    //     {name: {$eq: 'value'}},
    //     {age: {$gt: 20}},
    //     {goo: {$gte: 20}},
    //     {poo: {$lt: 20}},
    //     {pho: {$lte: 20}}
    //   ]
    // };
    // query = {
    //   $or: [
    //     {name: {$eq: 'value'}},
    //     {age: {$gt: 20}},
    //     {goo: {$gte: 20}},
    //     {poo: {$lt: 20}},
    //     {pho: {$lte: 20}}
    //   ]
    // };
    // query = {
    //   name: {$eq: 'value'},
    //   age: {$gt: 20},
    //   goo: {$gte: 20},
    //   poo: {$lt: 20},
    //   pho: {$lte: 20}
    // };
    // query = {
    //   poo: 10,
    //   $and: [
    //     {
    //       $or: [
    //         {age: 21}, {goo: 77}
    //       ]
    //     },
    //     {name: 'value'}
    //   ]
    // };
    // query = {
    //   name: {$exists: true}
    // };
    // query = {
    //   name: new RegExp('^val')
    // };
    query = {
      name: {$nin: ['value']}
    };
    const obj = {
      name: 'value',
      age: 21,
      goo: 21,
      poo: 10,
      pho: 11
    };

    const data = gsheet._selector(query, obj);
    console.log(data);
  });
});
