/*
    Submission related routes
 */

const express = require("express");
const Datastore = require("nedb-promises");
const router = express.Router();
router.use(express.json());

const submissionDb = new Datastore({
  filename: __dirname + "/submissionDB",
  autoload: true
});
submissionDb.ensureIndex({ fieldName: "task-name", unique: false });
submissionDb.ensureIndex({fieldName: "student-id", unique: false});
//taskDb.ensureIndex({ fieldName: "task-name", unique: true });

function validateSubmission(subInfo) {
  const allowedFields = ["task-name", "due", "status", "instructions"]; //Update
  let error = false;
  let message = "";
  // if (!taskInfo["task-name"]) {
  //   // Required field
  //   error = true;
  //   message += "missing task-name \n";
  // }
  // if (!taskInfo.instructions) {
  //   // Required field
  //   error = true;
  //   message += "missing instructions \n";
  // }
  // if (!taskInfo.status) {
  //   // Required field
  //   error = true;
  //   message += "missing status \n";
  // }

  return [error, message];
}

// router.post("/", function(req, res) {
//   let taskInfo = req.body; // This should be a JS Object
//   let [error, message] = validateTask(taskInfo);
//   if (error) {
//     res.status(400).json({ error: message });
//     return;
//   }
//   // TODO: Check for other required fields
//   taskDb
//     .find({ "task-name": taskInfo["task-name"] }) // task name already used?
//     .then(function(docs) {
//       // console.log(`docs: ${docs}`);
//       if (docs.length > 0) {
//         // console.log(`Task: ${taskInfo["task-name"]} already in DB`);
//         res.status(400); // Bad request
//         return { error: "task-name already used" };
//       } else {
//         // Not in DB so insert it
//         // TODO quality check taskInfo for require fields and such
//         return taskDb.insert(taskInfo).then(function(newDoc) {
//           //console.log(`new doc: ${JSON.stringify(newDoc)}`);
//           res.status(201); // Created
//           return { ...newDoc };
//         });
//       }
//     })
//     .then(function(msg) {
//       res.json(msg);
//     })
//     .catch(function(err) {
//       // Really important for debugging too!
//       console.log(`Something bad happened: ${err}`);
//       res.json({
//         registration: "failed",
//         name: userInfo.name,
//         reason: "internal error"
//       });
//     });
// });

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
  let [error, message] = validateSubmission(submissionInfo);
  if (error) {
    res.status(400).json({ error: message });
    return;
  }
  if (taskName !== taskInfo["task-name"]) {
    res.status(400).json({ error: "task-name and path don't match" });
    return;
  }
  // TODO: update this for "upsert", i.e., both update and insert.
  submissionDb
    .update({ "task-name": taskName }, taskInfo, { returnUpdatedDocs: true })
    .then(function(doc) {
      if (doc) {
        // console.log(doc);
        res.status(200).json(doc);
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    });
});

module.exports = router;
