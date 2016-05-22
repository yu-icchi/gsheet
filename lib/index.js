'use strict';

exports.test = () => {
  alert('test');
};

exports.onOpen = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const list = [
    {name: 'テスト', functionName: 'test'}
  ];
  ss.addMenu('GSheet', list);
};
