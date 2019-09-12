/*
    Assignment/peer review server
 */
const express = require("express");
const app = express();

const taskRoutes = require('./routes/taskRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/userRoutes');
const generalRoutes = require("./routes/generalRoutes");

app.use("/", generalRoutes);
app.use('/tasks',taskRoutes);
app.use('/submissions', submissionRoutes);
app.use('/users', userRoutes);

module.exports = app;