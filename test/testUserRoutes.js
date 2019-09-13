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
    q.then(function () {
      done();
    }).catch(done);
  });

  describe("Instructor Access", function () {
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
  })

  describe("Student Access", function () {
    const agent = request.agent(app);  // Used to remember cookies across multiple calls
    it("Student Login", function (done) {
      agent
        .put("/login")
        .set("Accept", "application/json")
        .send({
          email: testUsers[1].email,
          password: testUsers[1].password
        })
        .expect("Content-Type", /json/)
        .expect(function (res) {
          console.log(`login result: ${JSON.stringify(res.body)}`);
          console.log(`cookies: ${JSON.stringify(res.headers['set-cookie'])}`);
        })
        .expect(200, done);
    });

    it("Student Getting all users with json", function (done) {
      agent
        .get("/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(function (res) {
          console.log(res.body);
        })
        .expect(401, done);
    });
  })


  describe("Guest Access", function () {
    const agent = request.agent(app);  // Used to remember cookies across multiple calls
    it("Guest Getting all users with json", function (done) {
      agent
        .get("/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(function (res) {
          console.log(res.body);
        })
        .expect(401, done);
    });
  })



});
