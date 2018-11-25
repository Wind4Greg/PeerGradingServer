/*
    Create a NeDB datastore for tasks created by a *teacher*.
*/
const db = require("./submissionModel");

const submissions = require("./submissions1.json");

function resetSubmissions() {
  return db
    .remove({}, { multi: true })
    .then(function(numRemoved) {
      console.log(`Removed ${numRemoved} tasks`);
      let p = db.insert(submissions);
      console.log(p instanceof Promise);
      return p;
    })
    .catch(function(err) {
      console.log(`Some kind of problem: ${err}`);
      return err;
    });
}

module.exports = resetSubmissions;
