// Mocha test example
const request = require("supertest");
const assert = require("chai").assert;
const resetUsers = require("../testHelpers/initUserDB");
const express = require("express");
const app = express();
const generalRoutes = require("../routes/generalRoutes");

app.use("/", generalRoutes);

describe("General Routes", function() {
  before(function(done) {
    // Note use of done to deal with async tasks.
    let q = resetUsers();
    // console.log(`q is a promise? ${q instanceof Promise}`);
    // console.log(`q is ${JSON.stringify(q)}`);
    q.then(function() {
      done();
    }).catch(done);
  });

  describe("User login /login", function() {
    it("Good Login", function(done) {
      request(app)
        .put("/login")
        .set("Accept", "application/json")
        .send({
          email: "seersucker1910@outlook.com",
          password: "R3K[Iy0+"
        })
        .expect("Content-Type", /json/)
        .expect(function(res) {
          console.log(`login result: ${JSON.stringify(res.body)}`);
          //assert.equal(res.body["task-name"], "HW1.3");
        })
        .expect(200, done);
    });

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
