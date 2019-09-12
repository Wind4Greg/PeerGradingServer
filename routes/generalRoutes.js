/*
    general/generic routes such as login and logout
 */

const express = require("express");
const pbcrypt = require("../util/pbcryptjs");
const router = express.Router();
router.use(express.json());

// We need the user database to authenticate users.
const userDb = require("../models/userModel");

/*
  Login interface
  Note use of async function.
  This is so that we can use await and simple try catch to deal with errors.
 */
router.put("/login", async function(req, res) {
  let body = req.body;
  const email = body.email;

  try {
    let user = await userDb.findOne({ email: email });
    if (!user) {
      console.log(`couldn't find user, user email: ${email}`);
      res.status(401).json({ error: true, message: "User/Password error" });
    } else {
      console.log(`From login interface, user: ${JSON.stringify(user)}`);
      // Check password here
      let passCheck = await pbcrypt.compare(body.password, user.password);
      console.log(`From login result of password check: ${passCheck}`);
      if (passCheck) {
        res.json({message: `Good login, user email: ${email}`});
      } else {
              res.status(401).json({ error: true, message: "User/Password error" });
      }
    }
  } catch (e) {
    console.log(`Catching error: ${e}`);
    res.status(500).json({ error: true, message: "User/Password error" });
  }
});

module.exports = router;
