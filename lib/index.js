'use strict';

const GSheet = require('./gsheet');

const schema = {
  type: 'object',
  properties: {
    thumbnail: {
      type: 'integer'
    }
  }
};

exports.find = () => {
  const sheet = new GSheet({sheetName: 'list'});
  const result = sheet.find({gender: 'all'}, {}, {startRow: 21, startColumn: 1});
  alert(JSON.stringify(result));
};

exports.term = () => {
  const sheet = new GSheet({sheetName: 'list'});
  const result = sheet.find({}, {}, {startRow: 16, startColumn: 7, endRow: 17, endColumn: 8});
  alert(JSON.stringify(result));
};

exports.ids = () => {
  const sheet = new GSheet({sheetName: 'list'});
  const result = sheet.find({}, {}, {startRow: 19, startColumn: 6, endRow: 20, endColumn: 8});
  alert(JSON.stringify(result));
};

exports.saveValues = () => {
  const sheet = new GSheet({sheetName: 'Sheet2'});
  sheet.saveValues(
    [
      {
        thumbnail: '=IMAGE("http://s3-ap-northeast-1.amazonaws.com/stat.pigg-party.com/ad/popup/toy_1603/m/ad-popup-toy_1603.png")',
      },
      {
        thumbnail: '=IMAGE("http://s3-ap-northeast-1.amazonaws.com/stat.pigg-party.com/ad/popup/toy_1603/m/ad-popup-toy_1603.png")'
      },
      {
        thumbnail: '=IMAGE("http://s3-ap-northeast-1.amazonaws.com/stat.pigg-party.com/ad/popup/toy_1603/m/ad-popup-toy_1603.png")'
      },
      {
        thumbnail: '=IMAGE("http://s3-ap-northeast-1.amazonaws.com/stat.pigg-party.com/ad/popup/toy_1603/m/ad-popup-toy_1603.png")'
      },
      {
        thumbnail: '=IMAGE("http://s3-ap-northeast-1.amazonaws.com/stat.pigg-party.com/ad/popup/toy_1603/m/ad-popup-toy_1603.png")'
      }
    ],
    schema,
    {
      clear: true,
      row: 5,
      column: 5
    }
  );
};

exports.saveDesign = () => {
  const sheet = new GSheet({sheetName: 'Sheet2'});
  sheet.saveDesign(
    [
      {
        thumbnail: {background: '#EFEFEF', fontColor: '#00BBAA', fontWeight: 'bold', fontFamily: 'Helvetica'}
      },
      {
        thumbnail: {background: '#FF5555', fontColor: '#AADDDD'}
      },
      {
        thumbnail: {background: '#EE6666', fontWeight: 'bold'}
      },
      {
        thumbnail: {background: '#FFFFFF', fontSize: 20, fontStyle: 'italic', fontLine: 'line-through'}
      },
      {
        thumbnail: {background: '#F0F788', fontSize: 20, fontLine: 'underline'}
      }
    ],
    schema,
    {
      row: 1,
      column: 1
    }
  );
};

exports.remove = () => {
  console.log('まだないよ');
};

// スプレッドシートへの追加メニュー
exports.onOpen = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const list = [
    {name: 'find', functionName: 'find'},
    {name: 'term', functionName: 'term'},
    {name: 'ids', functionName: 'ids'},
    {name: 'saveValues', functionName: 'saveValues'},
    {name: 'saveDesign', functionName: 'saveDesign'},
    {name: 'remove', functionName: 'remove'}
  ];
  ss.addMenu('GSheet', list);
};
