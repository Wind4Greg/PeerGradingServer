/*
    Assignment/peer review server
 */
const express = require("express");
const app = express();
const session = require('express-session');

const taskRoutes = require('./routes/taskRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/userRoutes');
const generalRoutes = require("./routes/generalRoutes");

const cookieName = "PRevServe"; // Session ID cookie name, use this to delete cookies too.
app.use(session({
	secret: 'web systems CS651 CSUEB', // You must change this
	resave: false,
	saveUninitialized: false,
	name: cookieName // Sets the name of the cookie used by the session middleware
}));

// This initializes session state
const setUpSessionMiddleware = function (req, res, next) {
	console.log(`session object: ${JSON.stringify(req.session)}`);
	console.log(`session id: ${req.session.id}`);
	if (!req.session.user) {
		req.session.user = {
			loggedin: false,
			role: "guest",
		};
	}
	next();
};

app.use(setUpSessionMiddleware);

app.use("/", generalRoutes);
app.use('/tasks',taskRoutes);
app.use('/submissions', submissionRoutes);
app.use('/users', userRoutes);

module.exports = app;