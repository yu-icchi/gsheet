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
   * @param {number} row
   * @param {number} column
   * @param {number} [numRows]
   * @param {number} [numColumns]
   * @return {Array.<Object>}
   */
  data(row, column, numRows, numColumns) {
    if (!this._sheet) {
      return [];
    }

    const startRow = row - 1;
    const startColumn = column - 1;

    const range = this._sheet.getDataRange();
    const values = range.getValues();

    const indexKeys = values[startRow];
    const maxRow = numRows || values.length;
    const list = [];

    for (let i = startRow + 1; i < maxRow; i++) {
      const value = values[i];
      const obj = {};
      const maxColumns = numColumns || value.length;
      for (let j = startColumn; j < maxColumns; j++) {
        const key = indexKeys[j];
        obj[key] = values[i][j];
      }
      list.push(obj);
    }

    return list;
  }

  /**
   * 新しくシートを作成する
   * @private
   */
  _createSheet() {
    this._sheet = this._spreadsheet.insertSheet(this.sheetName);
  }

  // TODO: fieldsの-1での除外の実装ができていない
  find(query, fields, options) {
    query = query || {};
    fields = _.isEmpty(fields) ? null : _.keys(fields);
    options = _.isPlainObject(options) ? options : {};

    const row = _.isNumber(options.startRow) ? options.startRow : 1;
    const column = _.isNumber(options.startColumn) ? options.startColumn : 1;
    const numRows = _.isNumber(options.endRow) ? options.endRow : 0;
    const numColumns = _.isNumber(options.endColumn) ? options.endColumn : 0;

    const ret = [];
    const items = this.data(row, column, numRows, numColumns);
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

  /**
   * 値をシートに保存する
   * @param items
   * @param schema
   * @param options
   */
  saveValues(items, schema, options) {
    options = _.isPlainObject(options) ? options : {};

    if (!_.isPlainObject(schema) || schema.type !== 'object' || _.size(schema.properties) <= 0) {
      throw new TypeError('schema is object');
    }

    // 存在しないSheetの場合は新規に作成
    if (!this._sheet) {
      this._createSheet();
    }
    // クリアオプションがあれば全てをクリアする
    if (options.clear) {
      this._sheet.clear();
    }
    // ヘッダーを表示させない
    const isNonHeader = options.header === false;

    // 書き込む位置の変更オプション
    const row = _.isNumber(options.row) ? options.row : 1;
    const column = _.isNumber(options.column) ? options.column : 1;

    const indexKeys = _.keys(schema.properties);
    const maxRow = isNonHeader ? items.length : items.length + 1;
    const maxColumn = indexKeys.length;
    const range = this._sheet.getRange(row, column, maxRow, maxColumn);
    const list = [];
    if (!isNonHeader) {
      list[0] = _.map(indexKeys, (key) => {
        return key;
      });
    }
    _.forEach(items, (obj) => {
      const arr = [];
      _.forEach(indexKeys, (key, i) => {
        arr[i] = obj[key] || null;
      });
      list.push(arr);
    });
    range.setValues(list);
  }

  /**
   * デザインをシートに反映させる
   * @param items
   * @param schema
   * @param options
   */
  saveDesign(items, schema, options) {
    options = _.isPlainObject(options) ? options : {};

    // 存在しないSheetの場合は新規に作成
    if (!this._sheet) {
      this._createSheet();
    }
    // クリアオプションがあれば全てをクリアする
    if (options.clear) {
      this._sheet.clear();
    }
    // 書き込む位置の変更オプション
    const row = _.isNumber(options.row) ? options.row : 1;
    const column = _.isNumber(options.column) ? options.column : 1;

    const indexKeys = _.keys(schema.properties);
    const maxRow = items.length;
    const maxColumn = indexKeys.length;
    const range = this._sheet.getRange(row, column, maxRow, maxColumn);
    const bgColors = [], fontColors = [], fontWeights = [];
    const fontFamilies = [], fontSizes = [], fontLines = [], fontStyles = [];
    _.forEach(items, (obj) => {
      const bg = [], fc = [], fw = [], ff = [], fs = [], fl = [], ft = [];
      _.forEach(indexKeys, (key, i) => {
        const o = obj[key];
        bg[i] = (o && o.background) ? o.background : null;
        fc[i] = (o && o.fontColor) ? o.fontColor : null;
        fw[i] = (o && o.fontWeight) ? o.fontWeight : null;
        ff[i] = (o && o.fontFamily) ? o.fontFamily : null;
        fs[i] = (o && o.fontSize) ? o.fontSize : null;
        fl[i] = (o && o.fontLine) ? o.fontLine : null;
        ft[i] = (o && o.fontStyle) ? o.fontStyle : null;
      });
      bgColors.push(bg);
      fontColors.push(fc);
      fontWeights.push(fw);
      fontFamilies.push(ff);
      fontSizes.push(fs);
      fontLines.push(fl);
      fontStyles.push(ft);
    });

    range.setBackgrounds(bgColors);
    range.setFontColors(fontColors);
    range.setFontWeights(fontWeights);
    range.setFontFamilies(fontFamilies);
    range.setFontSizes(fontSizes);
    range.setFontLines(fontLines);
    range.setFontStyles(fontStyles);
  }

  remove(query) {
    if (!this._sheet) {
      return false;
    }

  }
}

module.exports = GSheet;
