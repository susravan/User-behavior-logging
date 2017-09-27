const sqlite = require('sqlite3');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class SqliteJson {
  constructor(database) {
    if (!(this instanceof SqliteJson)) {
      return new SqliteJson(database);
    }

    this.client = database instanceof sqlite.Database
      ? database
      : new sqlite.Database(database);

    return this;
  }

  json(sql, options, cb) {
    if (options instanceof Function) {
      cb = options;
    }

    if (sql instanceof Object) {
      options = sql;
      sql = null;
    }

    if (!sql) {
      // make sure the key is in the output
      if (
        options.key &&
        options.columns &&
        options.columns.indexOf(options.key) < 0
      ) {
        options.columns.push(options.key);
      }

      const columns = options.columns ? options.columns.join(', ') : '*';
      const where = options.where ? ` WHERE ${options.where}` : '';

      sql = `SELECT ${columns} FROM ${options.table}${where};`;
    }

    this.client.all(sql, (err, data) => {
      if (err) {
        cb(err);
        return;
      }

      if (options.key) {
        data = data.reduce((obj, item) => {
          obj[item[options.key]] = item;
          return obj;
        }, {});
      }

      cb(null, JSON.stringify(data));
    });

    return this;
  }

  save(table, filename, cb) {
    this.json(table, (err, data) => {
      if (err) cb(err);

      mkdirp(path.dirname(filename), err => {
        if (err) cb(err);

        fs.writeFile(filename, data, err => {
          if (err) cb(err);
          else cb(null, data);
        });
      });
    });

    return this;
  }

  tables(cb) {
    const query = "SELECT name FROM sqlite_master WHERE type='table'";

    this.client.all(query, (err, tables) => {
      if (err) {
        cb(err);
      }
      cb(null, tables.map(t => t.name));
    });

    return this;
  }
}

module.exports = SqliteJson;
