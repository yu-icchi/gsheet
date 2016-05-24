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
sheet.content.insert([], (err) => {
  console.log(err);
});
// insertはシートが存在したら追加で存在しなければ新規作成にするかな
sheet.content.update({}, {}, (err) => {
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

#### find(query, fields)

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

#### findOne(query, fields, callback)

```javascript
const GSheet = require('gsheet');
const sheet = new GSheet({sheetName: 'Sheet1', row: 1, column: 1, schema: jsonSchema});
sheet.findOne({}, {}, () => {
  callback();
});
```

#### insert(data, callback)

```javascript
const GSheet = require('gsheet');
const sheet = new GSheet({sheetName: 'Sheet1', row: 1, column: 1, schema: jsonSchema});
sheet.insert([
  {name: '', price: 120, id: '', order: 1},
  {name: '', price: 170, id: '', order: 2}
], callback);
```

#### update(query, update, callback)

```javascript
const GSheet = require('gsheet');
const sheet = new GSheet({sheetName: 'Sheet1', row: 1, column: 1, schema: jsonSchema});
sheet.update({}, {
  $set: {
    name: 'name',
    price: 120,
    id: 'id',
    order: 3
  }
}, callback);
```

#### remove(query, callback)

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
- $or
- $and
- $not
- $nor

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

