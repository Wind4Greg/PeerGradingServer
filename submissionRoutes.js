/*
    Submission related routes
 */

const express = require("express");
const Datastore = require("nedb-promises");
const router = express.Router();
router.use(express.json());

const submissionDb = require("./submissionModel");
// We need the task database to validate submissions.
const taskDb = require("./taskModel");

function validateSubmission(subInfo) {
  const allowedFields = ["task-name", "student-id", "content"];
  let error = false;
  let message = "";
  return taskDb
    .findOne({ "task-name": subInfo["task-name"] })
    .then(function(task) {
      if (task) {
        // is the task open
        if (task.status !== "open") {
          error = true;
          message += `Task ${task["task-name"]} is not open. \n`;
        }
        // More checks here
        return [error, message];
      } else {
        error = true;
        message += `Task ${subInfo["task-name"]} Not Found; \n`;
        return [error, message];
      }
    })
    .then(function(errMessage) {
      let [error, message] = errMessage;
      // Check student data base here
      return [error, message];
    })
    .catch(function(err) {
      error = true;
      message += `Internal issue task database: ${err}`;
      return [error, message];
    });
}

// Teacher interface get submissions for a particular task from all students
router.get("/:taskName", function(req, res) {
  const taskName = req.params.taskName;
  submissionDb
    .find({ "task-name": taskName })
    .then(function(docs) {
      let curDate = new Date();
      res.json({ submissions: docs });
    })
    .catch(function(err) {
      console.log(`Something bad happened: ${err}`);
      res.status(500).json({ error: "internal error" });
    });
});

// Student interface get all submissions for a particular student
// Access control: a student can only see their own work
router.get("/student/:studentID", function(req, res) {
  const studentID = req.params.studentID;
  submissionDb
    .find({ "student-id": studentID })
    .then(function(docs) {
      res.status(200).json({ submissions: docs });
    })
    .catch(function(err) {
      console.log(`Something bad happened: ${err}`);
      res.status(500).json({ error: "internal error" });
    });
});

// Get a specific task for a specific student
// Access control: a student can only see their own work
router.get("/:taskName/student/:studentID", function(req, res) {
  const taskName = req.params.taskName;
  const studentID = req.params.studentID;
  submissionDb
    .findOne({ "task-name": req.params.taskName, "student-id": studentID })
    .then(function(doc) {
      if (doc) {
        res.status(200).json({ submission: doc });
      } else {
        res.status(404).json({ error: "Not Found;" });
      }
    })
    .catch(function(err) {
      console.log(`Something bad happened: ${err}`);
      res.status(500).json({ error: "internal error" });
    });
});

// Delete a particular students particular submission. Used by teacher to delete
// inappropriate submissions.
// Access Control: teacher
router.delete("/:taskName/student/:studentID", function(req, res) {
  const taskName = req.params.taskName;
  const studentID = req.params.studentID;
  // console.log(taskName);
  submissionDb
    .remove({ "task-name": taskName, "student-id": studentID })
    .then(function(num) {
      if (num > 0) {
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ error: "not found" });
      }
    })
    .catch(function(err) {
      res.status(500).json({ error: err });
    });
});

// Put a specific task submission for a particular student
// Access control: 1. student's ID must match their logon student ID.
//                 2. can only update an "open" assignment.
//
router.put("/:taskName/student/:studentID", function(req, res) {
  const taskName = req.params.taskName;
  const studentID = req.params.studentID;
  let submissionInfo = req.body;
  submissionInfo["task-name"] = taskName;
  submissionInfo["student-id"] = studentID;
  submissionInfo.submitted = new Date().toJSON();

  validateSubmission(submissionInfo).then(function(errMessage) {
    let [error, message] = errMessage;
    if (error) {
      res.status(400).json({ error: message });
      return;
    }
    if (taskName !== submissionInfo["task-name"]) {
      res.status(400).json({ error: "task-name and path don't match" });
      return;
    }
    // Uses an "upsert", i.e., allows both update and insert.
    submissionDb
      .update(
        { "task-name": taskName, "student-id": studentID },
        submissionInfo,
        { returnUpdatedDocs: true, upsert: true }
      )
      .then(function(doc) {
        if (doc) {
          console.log(doc);
          res.status(200).json(doc);
        } else {
          res.status(404).json({ error: "Task not found" });
        }
      });
  });
});

module.exports = router;
