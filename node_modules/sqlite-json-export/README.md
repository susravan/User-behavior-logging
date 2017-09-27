# sqlite-json-export
> Convert Sqlite3 tables to JSON

[![Build Status](https://travis-ci.org/falcon-client/sqlite-json-export.svg?branch=master&maxAge=2592)](https://travis-ci.org/falcon-client/sqlite-json-export)
[![NPM version](https://badge.fury.io/js/sqlite-json-export.svg?maxAge=2592)](http://badge.fury.io/js/sqlite-json-export)
[![Dependency Status](https://img.shields.io/david/falcon-client/sqlite-json-export.svg?maxAge=2592)](https://david-dm.org/falcon-client/sqlite-json-export)
[![npm](https://img.shields.io/npm/dm/sqlite-json-export.svg?maxAge=2592)](https://npm-stat.com/charts.html?package=sqlite-json-export)

## Install

```bash
npm install --save sqlite-json-export
```

### Todo:
- [ ] Migrate to a Promise based API
- [ ] Extract all tables

## API

### constructor(database)

Create an instance of sqlite-json.

Example:
```js
const SqliteJsonExport = require('sqlite-json-export');
let exporter = new SqliteJsonExport('example.db');
```

#### database

The path to an SQLite database or a [sqlite3](https://github.com/mapbox/node-sqlite3) client instance.

Type: `sqlite3.Database` or string

Example:

```js
const SqliteJsonExport = require('sqlite-json-export');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./mydb.sqlite3');
const exporter = new SqliteJsonExport('example.db');
```

### json(sql, options, callback)

Export JSON from a specified table, and use it in the given callback.

Example:
```js
exporter.json('select * FROM myTable', (err, json) => {
  // handle error or do something with the JSON
  // "[{"foo": 1}, {"foo": 2}, {"foo": 3}]"
});
```

#### options.columns

An optional list of columns to output.

Type: Array

Example:
```js
exporter.json({table: 'myTable' columns: ['foo']}, (err, json) => {
  // "[{"foo": 1}, {"foo": 2}, {"foo": 3}]"
});
```

#### options.key

An optional column name.

By default, the result is an JSON array of objects. If `key` is given, a JSON object is returned, each row keyed to the given column value.

Type: string

Example:
```js
exporter.json('myTable', {key: 'foo'}, (err, json) => {
  // "{"1": {"foo": 1}, "2": {"foo": 2}, "3": {"foo": 3}}"
});
```

#### options.table

A table to address with the `columns`, and `where` options.

Type: string

#### options.where

A where clause to add to the query.

Type: string

Example:
```js
exporter.json({table: 'myTable', where: 'foo > 1'}, (err, json) => {
  // "[{"foo": 2}, {"foo": 3}]"
});
```

### tables(cb)

List all tables in the current database.

Example:
```js
exporter.tables((err, tables) => {
  // tables === ['foo', 'bar', 'baz']
});
```

### save(table, filename, cb)

Save the contents of a table to the specified output file.

Example:
```js
exporter.save('table_name', 'data/table_name.json', (err, data) => {
    // Optionally do something else with the JSON.
});
```
