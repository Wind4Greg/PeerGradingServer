/*
    Submission related routes
 */

const express = require("express");
const router = express.Router();
router.use(express.json());

const userDb = require("../models/userModel");

function validateUser(userInfo) {
  const allowedFields = ["task-name", "student-id", "content"];
  let error = false;
  let message = "";
  return [error, message];
}

// Use this middleware to restrict paths to instructors
const checkInstructor = function (req, res, next) {
	if (req.session.user.role !== "instructor") {
		res.status(401).json({error: "Not permitted"});
	} else {
		next();
	}
};

// Admin interface gets all users
router.get("/", checkInstructor, function(req, res) {
  const taskName = req.params.taskName;
  userDb
    .find({})
    .then(function(docs) {
      res.json({ users: docs });
    })
    .catch(function(err) {
      console.log(`Something bad happened: ${err}`);
      res.status(500).json({ error: "internal error" });
    });
});


module.exports = router;
