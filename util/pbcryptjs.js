/*
    A promise wrapper for bycriptjs.

 */
const bcrypt = require("bcryptjs");

exports.salt = function salt(num) {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(num, function(err, salt) {
      if (err) {
        reject(err);
      } else {
        resolve(salt);
      }
    });
  });
};

exports.hash = function hash(password, salt) {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

exports.saltHash = function saltHash(password, num) {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(password, num, function(err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

exports.compare = function compare(password, hash) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(password, hash, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
