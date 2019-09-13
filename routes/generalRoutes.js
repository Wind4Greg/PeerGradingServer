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
  const password = body.password;
  console.log(`login interface received json: ${JSON.stringify(body)}`);

  try {
    let user = await userDb.findOne({ email: email });
    if (!user) {
      console.log(`couldn't find user, user email: ${email}`);
      res.status(401).json({ error: true, message: "User/Password error" });
    } else {
      console.log(`From login interface, user: ${JSON.stringify(user)}`);
      // Check password here
      let passCheck = await pbcrypt.compare(password, user.password);
      console.log(`From login result of password check: ${passCheck}`);
      if (passCheck) {
        // Upgrade in priveledge, should generate new session id
        // Save old session information if any, create a new session
        let oldInfo = req.session.user;
        req.session.regenerate(function(err) {
          if (err) {
            console.log(err);
          }
          req.session.user = Object.assign(oldInfo, user, {
            loggedin: true
          });
          delete req.session.user.password;
          res.json({ message: 'Good login', user: req.session.user });
        });

      } else {
        res.status(401).json({ error: true, message: "User/Password error" });
      }
    }
  } catch (e) {
    console.log(`Catching error: ${e}`);
    res.status(500).json({ error: true, message: "User/Password error" });
  }
});

router.get('/logout', function (req, res) {
  let user = req.session.user;
  console.log(`The user was: ${JSON.stringify(user)}`);
	let options = req.session.cookie;
	req.session.destroy(function (err) {
		if (err) {
			console.log(err);
		}
		res.clearCookie("PRevServe", options); // the cookie name and options
		res.json({message: `Goodbye`});
	})
});

module.exports = router;
