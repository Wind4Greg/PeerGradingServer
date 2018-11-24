// Create a NeDB datastore for tasks created by a *teacher*.
//
// Remove the file taskDB before running this example
//
const DataStore = require("nedb-promises");
const db = new DataStore({ filename: __dirname + "/submissionDB", autoload: true });
db.ensureIndex({ fieldName: "task-name", unique: false });
db.ensureIndex({fieldName: "student-id", unique: false});
const submissions = require("./submissions1.json");

// We let NeDB create _id property for us.

function resetSubmissions() {
  return db.remove({}, { multi: true })
    .then(function(numRemoved) {
      // console.log(`Removed ${numRemoved} tasks`);
      let p = db.insert(submissions);
      // console.log(p instanceof Promise);
      return p;
    })
    .catch(function(err) {
      console.log(`Some kind of problem: ${err}`);
      return err;
    });
}

module.exports = resetSubmissions;