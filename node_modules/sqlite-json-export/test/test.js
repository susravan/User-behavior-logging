const fs = require('fs');
const child = require('child_process');
const sqlite = require('sqlite3');
const { sync: rimraf } = require('rimraf');
const { sync: mkdirp } = require('mkdirp');
const SqliteJson = require('../');

const data = [
  { name: 'Washington', id: 1 },
  { name: 'Adams', id: 2 },
  { name: 'Jefferson', id: 3 },
  { name: 'Madison', id: 4 },
  { name: 'Monroe', id: 5 },
  { name: 'Adams', id: 6 }
];

describe('sqliteToJson', function spec() {
  beforeAll(() => {
    rimraf('./tmp');
    mkdirp('./tmp');

    const db = new sqlite.Database('./tmp/tmp.db');
    this.sqlitejson = new SqliteJson(db);

    db.serialize(() => {
      db.run('CREATE TABLE presidents (name TEXT, id INT)');
      const stmt = db.prepare('INSERT INTO presidents VALUES (?, ?)');

      data.forEach(row => {
        stmt.run(row.name, row.id);
      });

      stmt.finalize();
    });

    this.command = 'node ./bin/sqlite-json.js';
  });

  it('accepts a filename', (done) => {
    const sj = new SqliteJson('tmp/foo.db');
    expect(sj).toBeInstanceOf(SqliteJson);
    done();
  });

  it('calls back with all tables in the specified database', (done) => {
    this.sqlitejson.tables((e, result) => {
      expect(result).toHaveLength(1);
      // expect(result).be.containDeep(['presidents']);
      done();
    });
  });

  it('exports a table to JSON', (done) => {
    this.sqlitejson.json({ table: 'presidents' }, (err, json) => {
      if (!err) {
        expect(JSON.parse(json)).toEqual(data);
        expect(JSON.parse(json)).toMatchSnapshot();
      }
      done(err);
    });
  });

  it('saves a table in a database to a file', (done) => {
    const dest = 'tmp/bar';

    this.sqlitejson.save({ table: 'presidents' }, dest, (err, data) => {
      if (!err) {
        expect(JSON.parse(data)).toEqual(JSON.parse(fs.readFileSync(dest)));
        expect(JSON.parse(data)).toMatchSnapshot();
      }
      done(err);
    });
  });

  it('accepts a key option', (done) => {
    const desired = data.reduce((o, v) => {
      o[v.name] = v;
      return o;
    }, {});

    this.sqlitejson.json({ table: 'presidents', key: 'name' }, (err, json) => {
      if (!err) {
        expect(JSON.parse(json)).toEqual(desired);
        expect(JSON.parse(json)).toMatchSnapshot();
      }
      done(err);
    });
  });

  it('attaches a key to the output', (done) => {
    const desired = data.reduce((o, v) => {
      o[v.name] = v;
      return o;
    }, {});

    this.sqlitejson.json(
      { table: 'presidents', key: 'name', columns: ['id'] },
      (err, json) => {
        if (!err) {
          expect(JSON.parse(json)).toEqual(desired);
          expect(JSON.parse(json)).toMatchSnapshot();
        }
        done(err);
      }
    );
  });

  it('filters with a where option', (done) => {
    const desired = data.filter(i => i.name === 'Adams', {});

    this.sqlitejson.json(
      { table: 'presidents', where: "name = 'Adams'" },
      (err, json) => {
        if (!err) {
          expect(json).toEqual(JSON.stringify(desired));
          expect(json).toMatchSnapshot();
        }
        done(err);
      }
    );
  });

  it('filters with a columns option', (done) => {
    const desired = data.map(i => ({ name: i.name }), {});

    this.sqlitejson.json({ table: 'presidents', columns: ['name'] }, (err, json) => {
      if (!err) {
        expect(JSON.parse(json)).toEqual(desired);
        expect(JSON.parse(json)).toMatchSnapshot();
      }
      done(err);
    });
  });

  it('accepts SQL with a callback', (done) => {
    const desired = data.map(i => ({ name: i.name }), {});

    this.sqlitejson.json('select name from presidents', (err, json) => {
      if (!err) {
        expect(JSON.parse(json)).toEqual(desired);
        expect(JSON.parse(json)).toMatchSnapshot();
      }
      done(err);
    });
  });

  it('accepts where, key, columns simultaneously', (done) => {
    const opts = {
      table: 'presidents',
      columns: ['name'],
      key: 'name',
      where: 'id == 1'
    };
    const desired = { Washington: { name: 'Washington' } };

    this.sqlitejson.json(opts, (err, json) => {
      if (!err) {
        expect(JSON.parse(json)).toEqual(desired);
        expect(JSON.parse(json)).toMatchSnapshot();
      }
      done(err);
    });
  });

  it.skip('cli works with options', (done) => {
    const args = ['./tmp/tmp.db', '--table', 'presidents'];

    child.exec(`${this.command} ${args.join(' ')}`, (e, result, err) => {
      if (e) {
        throw e;
      }
      if (err) {
        console.error('');
        console.error(err);
      }
      expect(JSON.parse(result)).toEqual(data);
      expect(JSON.parse(result)).toMatchSnapshot();
      done();
    });
  });

  it.skip('cli works with SQL', (done) => {
    const nodeargs = ['./tmp/tmp.db', '"SELECT * FROM presidents;"'];

    child.exec(`${this.command} ${nodeargs.join(' ')}`, (e, result, err) => {
      if (e) {
        throw e;
      }
      if (err) {
        console.error('');
        console.error(err);
      }

      expect(JSON.parse(result)).toEqual(data);
      expect(JSON.parse(result)).toMatchSnapshot();
    });
  });

  it.skip('cli SQL overrides options', (done) => {
    const nodeargs = [
      './tmp/tmp.db',
      '"SELECT * FROM presidents;"',
      '--where',
      'id==1'
    ];

    child.exec(`${this.command} ${nodeargs.join(' ')}`, (e, result, err) => {
      if (e) {
        throw e;
      }
      if (err) {
        console.error('');
        console.error(err);
      }

      expect(JSON.parse(result)).toEqual(data);
      expect(JSON.parse(result)).toMatchSnapshot();
      done();
    });
  });

  afterAll(() => {
    rimraf('./tmp');
  });
});
