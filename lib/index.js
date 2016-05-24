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
  const sheet = new GSheet({sheetName: 'Sheet1'});
  const result = sheet.find({age: {$gte: 20}}, {name: 1});
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
    {name: '読み込み', functionName: 'find'},
    {name: '書き込み', functionName: 'insert'}
  ];
  ss.addMenu('GSheet', list);
};
