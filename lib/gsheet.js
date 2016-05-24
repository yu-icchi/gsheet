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
    fields = _.isEmpty(fields) ? null : _.keys(fields);

    const ret = [];
    const items = this.readData();
    _.forEach(items, (obj) => {
      _.forEach(obj, (value, key) => {
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

  insert(items) {
    console.log(_.keys(this.schema.properties));
    if (!this._sheet) {
      this._sheet = this._spreadsheet.insertSheet(this.sheetName);
    }
    _.forEach(items, (obj) => {
      this._sheet.appendRow(_.values(obj));
    });
  }

  update(query, update) {

  }

  remove(query) {

  }
}

module.exports = GSheet;
