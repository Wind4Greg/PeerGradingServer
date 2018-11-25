/* We extract the submissionDb to this module to allow for sharing without
   trying to make NEDB fight itself by trying to create the same datastore multiple times
   with the same file.
   We just need one!

 */
const Datastore = require("nedb-promises");

const submissionDb = Datastore.create({
  filename: __dirname + "/submissionDB",
  autoload: true
});
submissionDb .ensureIndex({ fieldName: "task-name", unique: false });
submissionDb.ensureIndex({ fieldName: "student-id", unique: false });

module.exports = submissionDb;
