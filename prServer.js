/*
    Start of assignment/peer review server
 */
const express = require("express");
const app = express();
const taskRoutes = require('./taskRoutes');

app.use('/tasks',taskRoutes);

const host = '127.0.1.10';
const port = '5555';
app.listen(port, host, function () {
    console.log("jsonServer1.js app listening on IPv4: " + host +
	":" + port);
});