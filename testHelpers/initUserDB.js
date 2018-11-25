/*  Create a NeDB datastore for users created by a *admin*
    for use in testing.

    Note that we never, ever, put plaintext passwords into a user database. So
    we don't do it here. Test files are frequently used as code examples, so at
    a minimum we use the JavaScript only version of bcrypt for maximum compatibility.
*/

const db = require("../models/userModel");
const users = require("./students1.json");
const pbcrypt = require("../util/pbcryptjs");

function resetUsers() {
  return db
    .remove({}, { multi: true })
    .then(function(numRemoved) {
      // console.log(`Removed ${numRemoved} users \n`);
      let pUsers = users.map(function(u) {
        return pbcrypt.saltHash(u.password, 5).then(function(hash) {
          u.password = hash;
          return u;
        });
      });
      Promise.all(pUsers).then(function(hashedUsers) {
        let p = db.insert(hashedUsers); // We let NeDB create _id property for us.
        // console.log(hashedUsers);
        return p;
      });
    })
    .catch(function(err) {
      console.log(`Some kind of problem: ${err}`);
      return err;
    });
}

module.exports = resetUsers;
