'use strict';

const dm = require('./model.js');
const ut = require('./utils.js');

// exports.getLast = function (req, res) {
//   res.send(dm.loadMessages(req.query));
// };
//
// exports.post = function (req, res) {
//   res.send(dm.writeMessage(req.body));
// };


// Async
exports.getLast = function (req, res) {
  dm.loadMessages(req.query)
    .then(function (data) {
      res.send(data);
    })
    .catch(function (err) {
      res.status(500).send(err); // actually handle it (is it 400 or 500?)
    });
};

exports.post = function (req, res) {
  dm.writeMessage(req.body)
    .then(function (data) {
      res.send(data);
    })
    .catch(function(err){
      res.status(500).send(err); // actually handle it (is it 400 or 500?)
    });
};
