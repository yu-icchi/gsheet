'use strict';

const _ = require('lodash');

const Cursor = require('./cursor');

const OPERATORS = {
  EQ: '$eq',
  GT: '$gt',
  GTE: '$gte',
  LT: '$lt',
  LTE: '$lte'
};

class GSheet {

  constructor(config) {
    // public
    this.sheetName = config.sheetName;
    this.row = config.row;
    this.column = config.column;
    this.schema = config.schema;

    // private
    this._spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    this._sheet = this._spreadsheet.getSheetByName(this.sheetName);
  }
  
  readData() {
    const startRow = this.row || 1;
    const startColumn = this.column || 1;
    const maxRow = this._sheet.getLastRow();
    const maxColumn = this._sheet.getLastColumn();
    if (startRow > maxRow || startColumn > maxColumn) {
      return [];
    }
    const items = this._sheet.getSheetValues(startRow, startColumn, maxRow, maxColumn);
    const indexKeys = items.shift();
    return _.map(items, (item) => {
      return _.reduce(item, (o, v, i) => {
        const key = indexKeys[i];
        o[key] = v;
        return o;
      }, {});
    });
  }

  find(query, fields) {
    query = query || {};
    fields = fields || {};

    const ret = [];
    const items = this.readData();
    _.forEach(items, (obj) => {
      _.forEach(obj, (value, key) => {
        const queryValue = query[key];
        if (_.isUndefined(queryValue)) {
          return true; // continue
        }
        if (queryValue === value) {
          ret.push(obj);
          return false; // break
        } else if (queryValue && queryValue[OPERATORS.EQ] === value) {
          ret.push(obj);
          return false; // break
        } else if (queryValue && queryValue[OPERATORS.GT] < value) {
          ret.push(obj);
          return false; // break
        } else if (queryValue && queryValue[OPERATORS.GTE] <= value) {
          ret.push(obj);
          return false; // break
        } else if (queryValue && queryValue[OPERATORS.LT] > value) {
          ret.push(obj);
          return false; // break
        } else if (queryValue && queryValue[OPERATORS.LTE] >= value) {
          ret.push(obj);
          return false; // break
        }
      });
    });
    return new Cursor(ret);
  }

  insert(items, callback) {

  }

  update(query, update, callback) {

  }

  remove(query, callback) {

  }
}

module.exports = GSheet;
