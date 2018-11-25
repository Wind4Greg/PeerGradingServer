// Mocha test example
const request = require("supertest");
const assert = require("chai").assert;
const resetSubmissions = require("../initSubmissionDB");
const express = require("express");
const app = express();
const submissionRoutes = require("../submissionRoutes");

app.use("/submissions", submissionRoutes);

describe("Submission Routes", function() {
  before(function(done) {
    // Note use of done to deal with async tasks.
    let q = resetSubmissions();
    // console.log(`q is a promise? ${q instanceof Promise}`);
    // console.log(`q is ${JSON.stringify(q)}`);
    q.then(function() {
      done();
    }).catch(done);
  });

  describe("Teacher Get /submissions", function() {
    it("Getting HW1.1 submissions for all students with json", function(done) {
      request(app)
        .get("/submissions/HW1.1")
        .set("Accept", "application/json")
        // .expect("Content-Type", /json/)
        .expect(function(res) {
          console.log(
            `Number of HW1.1 submissions: ${res.body.submissions.length}`
          );
          assert.lengthOf(
            res.body.submissions,
            5,
            "There should be 5 submissions for HW1.1"
          );
        })
        .expect(200, done);
    });

    it("Getting submissions for a task that doesn't exist, HW1.13 json", function(done) {
      request(app)
        .get("/submissions/HW1.13")
        .set("Accept", "application/json")
        // .expect("Content-Type", /json/)
        .expect(function(res) {
          console.log(`Number of HW1.1 subs: ${res.body.submissions.length}`);
          assert.lengthOf(
            res.body.submissions,
            0,
            "There should be 0 submissions for HW1.13"
          );
        })
        .expect(200, done);
    });
  });

  describe("Student Get /submissions", function() {
    it("Getting a all the submissions for a single student, cw3337", function(done) {
      request(app)
        .get("/submissions/student/cw3337")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(function(res) {
          console.log(`# of subs for cw3337: ${res.body.submissions.length}`);
          assert.lengthOf(
            res.body.submissions,
            4,
            "There should be 4 submissions for cs3337"
          );
        })
        .expect(200, done);
    });

    it("Try to submissions for a non-existant student, xyz337", function(done) {
      request(app)
        .get("/submissions/student/xyz337")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(function(res) {
          console.log(`# of subs for xyz337: ${res.body.submissions.length}`);
          assert.lengthOf(
            res.body.submissions,
            0,
            "There should be 0 submissions for xyz337"
          );
        })
        .expect(200, done);
    });

    it("Getting a single submission HW1.1 for a single student, cw3337", function(done) {
      request(app)
        .get("/submissions/HW1.1/student/cw3337")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(function(res) {
          console.log(
            `HW1.1 of for cw3337: ${JSON.stringify(res.body.submission)}`
          );
          assert.equal(res.body.submission["task-name"], "HW1.1");
        })
        .expect(200, done);
    });

    it("Try getting a non-existant sub HW1.13 for a single student, cw3337", function(done) {
      request(app)
        .get("/submissions/HW1.13/student/cw3337")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(function(res) {
          assert.notExists(res.body.submission, "Should be null");
        })
        .expect(404, done);
    });
  });

    describe("Student Put", function() {
    it("updating a single submission HW1.3 for a single student, cw3337", function(done) {
      request(app)
        .put("/submissions/HW1.3/student/cw3337")
        .set("Accept", "application/json")
        .send({
          "task-name": "HW1.3",
          "student-id": "cw3337",
          content: "It is used in `redirects`."
        })
        .expect("Content-Type", /json/)
        .expect(function(res) {
          console.log(
            `Updated HW1.3 of for cw3337: ${JSON.stringify(res.body)}`
          );
          assert.equal(res.body["task-name"], "HW1.3");
        })
        .expect(200, done);
    });
  });
});
