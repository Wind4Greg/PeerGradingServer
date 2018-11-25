/*
    Task related routes
 */

const express = require("express");
// const Datastore = require("nedb-promises");
const router = express.Router();
router.use(express.json());

// const taskDb = new Datastore({
//   filename: __dirname + "/taskDB",
//   autoload: true
// });
// taskDb.ensureIndex({ fieldName: "task-name", unique: true });
const taskDb = require("./taskModel");

function validateTask(taskInfo) {
  const allowedFields = ["task-name", "due", "status", "instructions"];
  let error = false;
  let message = "";
  if (!taskInfo["task-name"]) {
    // Required field
    error = true;
    message += "missing task-name \n";
  }
  if (!taskInfo.instructions) {
    // Required field
    error = true;
    message += "missing instructions \n";
  }
  if (!taskInfo.status) {
    // Required field
    error = true;
    message += "missing status \n";
  }

  return [error, message];
}

router.post("/", function(req, res) {
  let taskInfo = req.body; // This should be a JS Object
  let [error, message] = validateTask(taskInfo);
  if (error) {
    res.status(400).json({ error: message });
    return;
  }
  // TODO: Check for other required fields
  taskDb
    .find({ "task-name": taskInfo["task-name"] }) // task name already used?
    .then(function(docs) {
      // console.log(`docs: ${docs}`);
      if (docs.length > 0) {
        // console.log(`Task: ${taskInfo["task-name"]} already in DB`);
        res.status(400); // Bad request
        return { error: "task-name already used" };
      } else {
        // Not in DB so insert it
        // TODO quality check taskInfo for require fields and such
        return taskDb.insert(taskInfo).then(function(newDoc) {
          //console.log(`new doc: ${JSON.stringify(newDoc)}`);
          res.status(201); // Created
          return { ...newDoc };
        });
      }
    })
    .then(function(msg) {
      res.json(msg);
    })
    .catch(function(err) {
      // Really important for debugging too!
      console.log(`Something bad happened: ${err}`);
      res.json({
        registration: "failed",
        name: userInfo.name,
        reason: "internal error"
      });
    });
});

// Get all the tasks
router.get("/", function(req, res) {
  taskDb
    .find({})
    .then(function(docs) {
      res.json({ tasks: docs });
    })
    .catch(function(err) {
      console.log(`Something bad happened: ${err}`);
      res.status(500).json({ error: "internal error" });
    });
});

// Get a specific task
router.get("/:taskName", function(req, res) {
  taskDb
    .findOne({ "task-name": req.params.taskName })
    .then(function(doc) {
      if (doc) {
        res.json({ task: doc });
      } else {
        res.status(404).json({ error: "Not Found;" });
      }
    })
    .catch(function(err) {
      console.log(`Something bad happened: ${err}`);
      res.status(500).json({ error: "internal error" });
    });
});

router.delete("/:taskName", function(req, res) {
  let taskName = req.params.taskName;
  // console.log(taskName);
  taskDb
    .remove({ "task-name": taskName })
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

// Put a specific task
router.put("/:taskName", function(req, res) {
  let taskName = req.params.taskName;
  let taskInfo = req.body;
  let [error, message] = validateTask(taskInfo);
  if (error) {
    res.status(400).json({ error: message });
    return;
  }
  if (taskName !== taskInfo["task-name"]) {
    res.status(400).json({ error: "task-name and path don't match" });
    return;
  }
  taskDb
    .update({ "task-name": taskName }, taskInfo, { returnUpdatedDocs: true })
    .then(function(doc) {
      if (doc) {
        // console.log(doc);
        res.status(200).json(doc);
      } else {
        res.status(404).json({ error: "Task not found"});
      }
    });
});

module.exports = router;
