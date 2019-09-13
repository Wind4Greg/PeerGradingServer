/*  Create a NeDB datastore for users created by a *admin*
    for use in testing.

    Note that we never, ever, put plaintext passwords into a user database. So
    we don't do it here. Test files are frequently used as code examples, so at
    a minimum we use the JavaScript only version of bcrypt for maximum compatibility.
*/

const db = require("../models/userModel");
const users = require("./users1.json");
const pbcrypt = require("../util/pbcryptjs");

async function resetUsers() {
  try {
    let numRemoved = await db.remove({}, {multi: true});
    // console.log(`Removed ${numRemoved} users \n`);

    for (let user of users) {
      let hash = await pbcrypt.saltHash(user.password, 5);
      let hashedUser = Object.assign({}, user, {password: hash}); // Make a copy for safety.
      // console.log(hashedUser);
      let newdoc = await db.insert(hashedUser);
      // console.log(newdoc);
    }
  } catch (err) {
    console.log(`Some kind of problem: ${err}`);
    return err;
  }
}

module.exports = resetUsers;
