// Test the "task", i.e., assignment related routes
const request = require("supertest");
const assert = require("chai").assert;
const resetUsers = require("../testHelpers/initUserDB");
const express = require("express");
const app = express();
const userRoutes = require("../routes/userRoutes");

app.use("/users", userRoutes);

describe("taskRoutes", function() {
  before(function(done) {
    // Note use of done to deal with async tasks.
    let q = resetUsers();
    // console.log(`q is a promise? ${q instanceof Promise}`);
    // console.log(`q is ${JSON.stringify(q)}`);
    q.then(function() {
      done();
    }).catch(done);
  });

  it("Getting all users with json", function(done) {
    request(app)
      .get("/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(function(res) {
        console.log(`There are ${res.body.users.length} users`);
        assert.lengthOf(res.body.users, 35, "There should be 35 users");
      })
      .expect(200, done);
  });

  it("Getting a single user");

  it("Putting multiple users");
});
