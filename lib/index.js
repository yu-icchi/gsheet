'use strict';

const GSheet = require('./gsheet');

const schema = {
  type: 'object',
  properties: {
    order: {
      type: 'integer'
    },
    name: {
      type: 'string'
    }
  }
};

exports.find = () => {
  const sheet = new GSheet({sheetName: 'list', row: 21, column: 2});
  const result = sheet.find({gender: 'all'}, {name: 1});
  alert(JSON.stringify(result));
};

exports.insert = () => {
  const sheet = new GSheet({sheetName: 'Sheet2', schema: schema});
  sheet.insert([
    {
      name: 'test',
      age: null,
      foo: 'hoge'
    }
  ]);
};

exports.onOpen = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const list = [
    {name: 'find', functionName: 'find'},
    {name: 'insert', functionName: 'insert'}
  ];
  ss.addMenu('GSheet', list);
};
