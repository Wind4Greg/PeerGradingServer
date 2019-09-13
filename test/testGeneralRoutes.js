// Mocha test example
const request = require("supertest");
const assert = require("chai").assert;
const resetUsers = require("../testHelpers/initUserDB");
const cookie = require("cookie");
const app = require("../prServer");
const testUsers = require("../testHelpers/users1.json"); // Users with passwords


describe("General Routes", function() {
  before(function(done) {
    console.log("Test user:");
    console.log(testUsers[0]);
    // Note use of done to deal with async tasks.
    let q = resetUsers();
    // console.log(`q is a promise? ${q instanceof Promise}`);
    // console.log(`q is ${JSON.stringify(q)}`);
    q.then(function() {
      done();
    }).catch(done);
  });

  describe("User login /login", function() {

    const agent = request.agent(app);  // Used to remember cookies across multiple calls

    it("Good Login", function(done) {
      agent
        .put("/login")
        .set("Accept", "application/json")
        .send({
          email: testUsers[0].email,
          password: testUsers[0].password
        })
        .expect("Content-Type", /json/)
        .expect(function(res) {
          console.log(`login result: ${JSON.stringify(res.body)}`);
          console.log(`cookies: ${JSON.stringify(res.headers['set-cookie'])}`);
          console.log(cookie.parse(res.headers['set-cookie'][0]));
        })
        .expect(200, done);
    });

    it("Logout", function(done){
      agent
        .get("/logout")
        .expect(function(res){
          console.log(`cookies: ${JSON.stringify(res.headers['set-cookie'])}`);
          console.log(cookie.parse(res.headers['set-cookie'][0]));
        })
        .expect(200, done);
    })

    it("Bad Password", function(done) {
      request(app)
        .put("/login")
        .set("Accept", "application/json")
        .send({
          email: "seersucker1910@outlook.com",
          password: "!R3K[Iy0+"
        })
        .expect("Content-Type", /json/)
        .expect(function(res) {
          console.log(`login result: ${JSON.stringify(res.body)}`);
          //assert.equal(res.body["task-name"], "HW1.3");
        })
        .expect(401, done);
    });
  });
  describe("Bad User login /login", function() {
    it("Login", function(done) {
      request(app)
        .put("/login")
        .set("Accept", "application/json")
        .send({
          email: "leersucker1910@outlook.com", // Not a user email
          password: '"R3K[Iy0+"'
        })
        .expect("Content-Type", /json/)
        .expect(function(res) {
          console.log(`login result: ${JSON.stringify(res.body)}`);
          //assert.equal(res.body["task-name"], "HW1.3");
        })
        .expect(401, done);
    });
  });
});
