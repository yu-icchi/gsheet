'use strict';

const GSheet = require('./gsheet');

const schema = {
  type: 'object',
  properties: {
    thumbnail: {
      type: 'integer',
      width: 300
    }
  }
};

exports.find = () => {
  const schema = {
    type: 'object',
    properties: {
      thumbnail: {
        type: 'string'
      },
      category: {
        type: 'string'
      },
      type: {
        type: 'string'
      },
      gender: {
        type: 'string'
      },
      id: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      memo: {
        type: 'string'
      },
      rarity: {
        type: 'string'
      },
      rank: {
        type: 'integer'
      },
      price: {
        type: 'integer'
      },
      tabId: {
        type: 'boolean'
      },
      wearset: {
        type: 'array'
      },
      contentId: {
        type: 'string'
      }
    }
  };
  const sheet = new GSheet({sheetName: 'list'});
  const result = sheet.find({
    $and: [
      {gender: 'all'},
      {category: 'wear'}
    ]
  }, {memo: -1}, {startRow: 21, startColumn: 2, schema: schema});
  const wSheet = new GSheet({sheetName: 'list2'});
  wSheet.saveValues(result, schema, {});
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
        thumbnail: '=IMAGE("https://www.google.co.jp/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png")'
      }
    ],
    schema,
    {
      clear: true,
      startRow: 1,
      startColumn: 2
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
      clear: true,
      startRow: 1,
      startColumn: 2,
      autoResizeColumn: true,
      rowHeight: 200
    }
  );
};

exports.drop = () => {
  const sheet = new GSheet({sheetName: 'Sheet2'});
  sheet.drop();
};

exports.remove = () => {
  const schema = {
    type: 'object',
    properties: {
      thumbnail: {
        type: 'string'
      },
      category: {
        type: 'string'
      },
      type: {
        type: 'string'
      },
      gender: {
        type: 'string'
      },
      id: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      memo: {
        type: 'string'
      },
      rarity: {
        type: 'string'
      },
      rank: {
        type: 'integer'
      },
      price: {
        type: 'integer'
      },
      tabId: {
        type: 'boolean'
      },
      wearset: {
        type: 'array'
      },
      contentId: {
        type: 'string'
      }
    }
  };
  const sheet = new GSheet({sheetName: 'list2'});
  sheet.remove({gender: 'all'}, schema);
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
    {name: 'remove', functionName: 'remove'},
    {name: 'drop', functionName: 'drop'}
  ];
  ss.addMenu('GSheet', list);
};
