'use strict';

// const fs = require('fs');
// const database = './db/messages.db';

const pg = require('pg');

const dm = {};

const dbConfig = {
  user: 'postgres',
  database: 'chat-app',
  password: 'ylaeuropea?',
  host: 'localhost',
  max: 10,
  idleTimeoutMillis: 30000
};

const pool = new pg.Pool(dbConfig);

dm.writeMessage = function(message) {
  return new Promise(function (resolve, reject) {
    var timestamp = Date.now();
    pool.connect(function (err, client, done) {
      if (err) reject(err);
      client.query('INSERT INTO messages (content, timestamp) VALUES ($1,$2);', [message.content, timestamp], function (err, result) {
        done();  // release the client back to the pool
        if (err) reject(err);
        resolve({content: message.content, timestamp: timestamp});
      });
    });
  });
};

dm.loadMessages = function (options) {
  return new Promise(function (resolve, reject) {
    let query;
    let value;
    if (options && options.limit) {
      query = 'SELECT content, timestamp FROM messages ORDER BY timestamp DESC LIMIT $1;';
      value = options.limit;
    } else if (options && options.lasttimestamp) {
      query = 'SELECT content, timestamp FROM messages WHERE timestamp > $1 ORDER BY timestamp ASC;';
      value = options.lasttimestamp;
    }
    pool.connect(function (err, client, done) {
      if (err) reject(err);
      client.query(query, [ value ], function (err, result) {
        done();  // release the client back to the pool
        if (err) reject(err);
        else resolve(result.rows.reverse());
      });
    });
  });
};

module.exports = dm;
