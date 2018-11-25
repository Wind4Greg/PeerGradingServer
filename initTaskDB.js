// Create a NeDB datastore for tasks created by a *teacher*.
//
// Remove the file taskDB before running this example
//
// const DataStore = require("nedb-promises");
// const db = new DataStore({ filename: __dirname + "/taskDB", autoload: true });
// db.ensureIndex({ fieldName: "task-name", unique: true });
const db = require("./taskModel");
const tasks = require("./tasks1.json");
// We let NeDB create _id property for us.

function resetTasks() {
  return db.remove({}, { multi: true })
    .then(function(numRemoved) {
      // console.log(`Removed ${numRemoved} tasks`);
      let p = db.insert(tasks);
      // console.log(p instanceof Promise);
      return p;
    })
    .catch(function(err) {
      console.log(`Some kind of problem: ${err}`);
      return err;
    });
}

module.exports = resetTasks;