/* We extract the submissionDb to this module to allow for sharing without
   trying to make NEDB fight itself by trying to create the same datastore multiple times
   with the same file.
   We just need one!

 */
const path = require("path");
const Datastore = require("nedb-promises");
const dbFile = path.join(__dirname, '../', 'submissionDB')

const submissionDb = Datastore.create({
  filename: dbFile,
  autoload: true
});
submissionDb .ensureIndex({ fieldName: "task-name", unique: false });
submissionDb.ensureIndex({ fieldName: "student-id", unique: false });

module.exports = submissionDb;
