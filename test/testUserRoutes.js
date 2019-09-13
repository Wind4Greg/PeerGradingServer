// Test the "task", i.e., assignment related routes
const request = require("supertest");
const assert = require("chai").assert;
const resetUsers = require("../testHelpers/initUserDB");
const app = require("../prServer");
const testUsers = require("../testHelpers/users1.json"); // Users with passwords

describe("User Routes", function () {
  before(function (done) {
    // Note use of done to deal with async tasks.
    let q = resetUsers();
    // console.log(`q is a promise? ${q instanceof Promise}`);
    // console.log(`q is ${JSON.stringify(q)}`);
    q.then(function () {
      done();
    }).catch(done);
  });

  const agent = request.agent(app);  // Used to remember cookies across multiple calls
  it("Instructor Login", function (done) {
    agent
      .put("/login")
      .set("Accept", "application/json")
      .send({
        email: testUsers[0].email,
        password: testUsers[0].password
      })
      .expect("Content-Type", /json/)
      .expect(function (res) {
        console.log(`login result: ${JSON.stringify(res.body)}`);
        console.log(`cookies: ${JSON.stringify(res.headers['set-cookie'])}`);
      })
      .expect(200, done);
  });

  it("Instructor Getting all users with json", function (done) {
    agent
      .get("/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(function (res) {
        console.log(res.body);
        console.log(`There are ${res.body.users.length} users`);
        assert.lengthOf(res.body.users, 35, "There should be 35 users");
      })
      .expect(200, done);
  });

});
