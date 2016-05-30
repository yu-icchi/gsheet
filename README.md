# gsheet

Google Apps ScriptでのSpreadSheetでMongoDBのクエリlikeに操作する

## Install

```sh
$ npm install
```

## Using

```javascript
const GSheet = require('gsheet');
const sheet = new GSheet({sheetName: 'Sheet1'})
const result = sheet.find({gender: 'all'}, {memo: -1}, {startRow: 1, startColumn: 1, schema: schema});
sheet.saveValues([{gender: 'all'}, {gender: 'male'}, {gender: 'female'}], schema, {clear: true, startRow: 1, startColumn: 1});
sheet.saveDesign([{gender: {background: '#FF5555'}}], schema, {clear: true, autoResizeColumn: true, rowHeight: 100});
```

## API

### GSheet

- sheetName
シートの名前を指定する

#### find(query, fields, options)

シートから指定した条件の内容に一致する情報を取得する

##### query

- **$eq**
- **$gt**
- **$gte**
- **$lt**
- **$lte**
- **$ne**
- **$in**
- **$or**
- **$and**
- **$exists**

##### fields

結果から取得フィールドを絞り込む

##### options

|name|type|description|
|:---|:--|:--|
|startRow|integer|開始Rowの位置|
|startColumn|integer|開始Columnの位置|
|endRow|integer|終了Rowの位置|
|endColumn|integer|終了Columnの位置|
|schema|object|オプション(JSONSchema)|

#### saveValues(items, schema, options)

シートに値を保存する

##### items

保存するデータ内容(Arrayである必要あり)

##### schema

JSONSchemaでの指定(rootはtype:objectであること)

##### options

|name|type|description|
|:---|:--|:--|
|startRow|integer|開始Rowの位置(デフォルト:1)|
|startColumn|integer|開始Columnの位置(デフォルト: 1)|
|clear|boolean|リセット指定(contentだけ削除する)|
|header|boolean|ヘッダー無しの場合は**false**指定すること|

#### saveDesign(items, schema, options)

シートのデザインを保存する

##### items

```javascript
[
  {
    name: {
      background: '#EFEFEF', // バックグラウンドカラー
      fontColor: '#00BBAA', // フォントカラー
      fontWeight: 'bold', // フォントの太字
      fontFamily: 'Helvetica', // フォントファミリー
      fontSize: 20, // フォントサイズ
      fontStyle: 'italic' // フォントスタイル
      fontLine: 'line-through' // フォントライン
    }
  }
]
```
※指定の値はGoogleAppsScriptのドキュメントを参照

##### schema

JSONSchemaでの指定

##### options

|name|type|description|
|:---|:--|:--|
|startRow|integer|開始Rowの位置(デフォルト:1)|
|startColumn|integer|開始Columnの位置(デフォルト: 1)|
|clear|boolean|リセット指定(デザイン部分だけ削除する)|

#### remove(query, schema, options)

条件に一致した内容を削除する

##### query

- **$eq**
- **$gt**
- **$gte**
- **$lt**
- **$lte**
- **$ne**
- **$in**
- **$or**
- **$and**
- **$exists**

##### schema

JSONSchemaでの指定

##### options

|name|type|description|
|:---|:--|:--|
|startRow|integer|開始Rowの位置|
|startColumn|integer|開始Columnの位置|
|endRow|integer|終了Rowの位置|
|endColumn|integer|終了Columnの位置|

#### drop(options)

シートの内容を削除する

##### options

オプションはGoogleAppsScriptのドキュメント参照
