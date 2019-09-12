// Test the "task", i.e., assignment related routes
const request = require("supertest");
const assert = require("chai").assert;
const resetTasks = require("../testHelpers/initTaskDB");
const app = require("../prServer");

describe("taskRoutes", function() {
  before(function(done) {
    // Note use of done to deal with async tasks.
    let q = resetTasks();
    // console.log(`q is a promise? ${q instanceof Promise}`);
    // console.log(`q is ${JSON.stringify(q)}`);
    q.then(function() {
      done();
    }).catch(done);
  });

  describe("Get /tasks", function() {
    it("Getting all tasks with json", function(done) {
      request(app)
        .get("/tasks")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(function(res) {
          assert.lengthOf(res.body.tasks, 4, "There should be 4 tasks");
        })
        .expect(200, done);
    });

    it("Getting a single task: HW1.5", function(done) {
      request(app)
        .get("/tasks/HW1.5")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, done);
    });

    it("Trying to get a nonexistant task: HW1.13", function(done) {
      request(app)
        .get("/tasks/HW1.13")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(404, done);
    });
  });

  describe("Post /tasks", function() {
    it("Post a task that exists: HW2.1", function(done) {
      const atask = {
        "task-name": "HW2.1",
        due: "2018-12-08T00:00:00.000Z",
        status: "closed",
        instructions:
          "When would you prefer *Argon2* over *Bcrypt* and vice versa?"
      };
      request(app)
        .post("/tasks")
        .set("Accept", "application/json")
        .send(atask)
        .expect("Content-Type", /json/)
        .expect(function(res) {
          assert.exists(res.body.error);
        })
        .expect(400, done);
    });

    it("Post a new task: HW3.1", function(done) {
      const atask = {
        "task-name": "HW3.1",
        due: "2018-12-09T00:00:00.000Z",
        status: "open",
        instructions:
          "Should you use unit tests? Give an example of a test library."
      };
      request(app)
        .post("/tasks")
        .set("Accept", "application/json")
        .send(atask)
        .expect("Content-Type", /json/)
        .expect(function(res) {
          assert.include(res.body, atask);
          //console.log(res.body);
        })
        .expect(201, done);
    });

    it("Post a new bad task: HW4.1", function(done) {
      const atask = {
        // Missing task-name
        due: "2018-12-09T00:00:00.000Z",
        status: "open",
        instructions: "What is an integration test?"
      };
      request(app)
        .post("/tasks")
        .set("Accept", "application/json")
        .send(atask)
        .expect("Content-Type", /json/)
        .expect(function(res) {
          assert.exists(res.body.error);
          //console.log(res.body);
        })
        .expect(400, done);
    });
  });

  describe("Delete /tasks", function() {
    it("Delete a task that exists: HW3.1", function(done) {
      request(app)
        .delete("/tasks/HW3.1/")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(function(res) {
          //console.log(res.body);
          assert.exists(res.body.success);
        })
        .expect(200, done);
    });

    it("Try to delete a task that exists anymore: HW3.1", function(done) {
      request(app)
        .delete("/tasks/HW3.1/")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(function(res) {
          //console.log(res.body);
          assert.exists(res.body.error);
        })
        .expect(404, done);
    });
  });

  describe("Put /tasks", function() {
    it("Update a task that exists: HW2.1", function(done) {
      let atask = {
        "task-name": "HW2.1",
        due: "2018-12-08T00:00:00.000Z",
        status: "open", // Originally closed
        instructions:
          "When would you prefer *Argon2* over *Bcrypt* and vice versa?"
      };
      request(app)
        .put("/tasks/HW2.1/")
        .set("Accept", "application/json")
        .send(atask)
        .expect("Content-Type", /json/)
        .expect(function(res) {
          // console.log(res.body);
          assert.include(res.body, atask);
        })
        .expect(200, done);
    });

    it("Try to update a non-existant task: HW6.1", function(done) {
      let atask = {
        "task-name": "HW6.1",
        due: "2018-12-12T00:00:00.000Z",
        status: "open", // Originally closed
        instructions: "Why use HTML5?"
      };
      request(app)
        .put("/tasks/HW6.1/")
        .set("Accept", "application/json")
        .send(atask)
        .expect("Content-Type", /json/)
        .expect(function(res) {
          // console.log(res.body);
          assert.exists(res.body.error);
        })
        .expect(404, done);
    });
  });
});
