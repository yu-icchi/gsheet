'use strict';

const _ = require('lodash');

const OPERATORS = {
  EQ: '$eq', // equal
  GT: '$gt', // greater than
  GTE: '$gte', // greater than or equal
  LT: '$lt', // less than
  LTE: '$lte', // less than or equal
  NE: '$ne' // not equal
};

class GSheet {

  constructor(config) {
    // public
    this.sheetName = config.sheetName;
    if (_.isEmpty(this.sheetName)) {
      throw new Error('sheet name is not found.');
    }
    this.row = config.row || 1;
    this.column = config.column || 1;
    this.schema = config.schema;
    this.primaryKey = config.primaryKey;

    // private
    this._spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    this._sheet = this._spreadsheet.getSheetByName(this.sheetName);
  }

  /**
   * スプレッドシートの指定した位置からデータを読取る
   * @return {Array.<Object>}
   * @private
   */
  _readData() {
    if (!this._sheet) {
      return [];
    }
    const maxRow = this._sheet.getMaxRows();
    const maxColumn = this._sheet.getMaxColumns();
    if (this.row > maxRow || this.column > maxColumn) {
      return [];
    }
    const items = this._sheet.getSheetValues(this.row, this.column, maxRow, maxColumn);
    const indexKeys = items.shift();
    return _.map(items, (item) => {
      return _.reduce(item, (o, v, i) => {
        const key = indexKeys[i];
        o[key] = v;
        return o;
      }, {});
    });
  }

  /**
   * 新しくシートを作成する
   * @private
   */
  _createSheet() {
    this._sheet = this._spreadsheet.insertSheet(this.sheetName);
  }

  find(query, fields) {
    query = query || {};
    fields = _.isEmpty(fields) ? null : _.keys(fields);

    const ret = [];
    const items = this._readData();
    _.forEach(items, (obj) => {
      _.forEach(obj, (value, key) => {
        if (_.isPlainObject(query) && _.isEmpty(query)) {
          ret.push(fields ? _.pick(obj, fields) : obj);
          return false; // break
        }
        const queryValue = query[key];
        if (_.isUndefined(queryValue)) {
          return true; // continue
        }
        if (queryValue === value) {
          ret.push(fields ? _.pick(obj, fields) : obj);
          return false; // break
        }
        if (_.isEmpty(queryValue)) {
          return true; // continue
        }
        if (queryValue[OPERATORS.EQ] === value) {
          ret.push(fields ? _.pick(obj, fields) : obj);
          return false; // break
        } else if (queryValue[OPERATORS.GT] < value) {
          ret.push(fields ? _.pick(obj, fields) : obj);
          return false; // break
        } else if (queryValue[OPERATORS.GTE] <= value) {
          ret.push(fields ? _.pick(obj, fields) : obj);
          return false; // break
        } else if (queryValue[OPERATORS.LT] > value) {
          ret.push(fields ? _.pick(obj, fields) : obj);
          return false; // break
        } else if (queryValue[OPERATORS.LTE] >= value) {
          ret.push(fields ? _.pick(obj, fields) : obj);
          return false; // break
        } else if (queryValue[OPERATORS.NE] && queryValue[OPERATORS.NE] !== value) {
          ret.push(fields ? _.pick(obj, fields) : obj);
          return false; // break
        }
      });
    });
    return ret;
  }

  _convertDataToArray(items) {
    const ret = [];
    const indexKeys = _.keys(this.schema.properties);
    _.forEach(items, (obj) => {
      const arr = [];
      _.forEach(indexKeys, (key, i) => {
        arr[i] = obj[key] || null;
      });
      ret.push(arr);
    });
    return ret;
  }

  insert(items, options) {
    if (!this._sheet) {
      this._createSheet();
    }
    items = this._convertDataToArray(items);
    _.forEach(items, (value) => {
      this._sheet.appendRow(value);
    });
  }

  update(query, update) {
    if (!this._sheet) {
      this._createSheet();
    }
  }

  remove(query) {

  }
}

module.exports = GSheet;
