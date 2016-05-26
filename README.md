# gsheet

Google Apps ScriptでのSpreadSheetでMongoDBのクエリlikeに操作する

## Install

```sh
$ npm install
```

## Using

```javascript
const GSheet = require('gsheet');
const sheet = new GSheet({sheets: ['list', 'content', 'shop', 'wear', 'interior', 'gacha']})
sheet.list.find({}).skip(21).toArray((err, list) => {
  console.log(err, list);
});
sheet.content.saveValues([], (err) => {
  console.log(err);
});
```

## API

### GSheet

- sheetName
シートの名前を指定する

- row
データを読み書きするための基準値

- column
データを読み書きするための基準値

- schema
JSONSchemaで定義し、シートから読み込み時にはデータの型変換やデフォルトの代入などをおこない、更新時には適切なデータが存在するかのチェックを行う

PRIMARY KEYが必要かもしれない

#### find(query, fields, options)

- fields
オプション指定

```javascript
const GSheet = require('gsheet');
const sheet = new GSheet({sheetName: 'Sheet1', row: 1, column: 1, schema: jsonSchema});
sheet.find({}, {}).toArray((list) => {
  callback();
});
sheet.find({}, {}).forEach((data, cell, next) => {
  next();
}, callback);
```

#### save()

#### remove(query)

```javascript
const GSheet = require('gsheet');
const sheet = new GSheet({sheetName: 'Sheet1', row: 1, column: 1, schema: jsonSchema})
sheet.remove({}, callback);
```

## operators

- $eq
- $gt
- $gte
- $lt
- $lte
- $ne
- $and
- $or
- $not

### SpreadSheet用のオペレーター

- $setValue(value)
- $setBackground(color)
- $setFontColor(color)
- $setFontFamily(fontFamily)
- $setFontLine(fontLine)
- $setFontSize(size)
- $setFontStyle(fontStyle)
- $setFontWeight(fontWeight)
- $setFormula(formula)

