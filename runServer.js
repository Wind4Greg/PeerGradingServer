/*
    Assignment/peer review server
 */
const app = require("./prServer");

const host = '127.0.1.10';
const port = '5555';
app.listen(port, host, function () {
    console.log("jsonServer1.js app listening on IPv4: " + host +
	":" + port);
});
