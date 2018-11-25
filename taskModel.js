/* We extract the taskDb to this module to allow for sharing without
   trying to make NEDB fight itself by trying to create the same datastore multiple times
   with the same file.
   We just need one!

 */
const Datastore = require("nedb-promises");

const taskDb = Datastore.create({
  filename: __dirname + "/taskDB",
  autoload: true
});
taskDb.ensureIndex({ fieldName: "task-name", unique: true });

module.exports = taskDb;
