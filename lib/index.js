'use strict';

const GSheet = require('./gsheet');

exports.test = () => {
  const sheet = new GSheet({sheetName: 'Sheet1'});
  sheet.find({age: {$gte: 20}}).toArray((err, result) => {
    console.log(err);
    console.log(JSON.stringify(result, null, 2));
  });
};

exports.onOpen = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const list = [
    {name: 'テスト', functionName: 'test'}
  ];
  ss.addMenu('GSheet', list);
};
