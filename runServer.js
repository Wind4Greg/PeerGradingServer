/*
    Assignment/peer review server run file.
    Pulled this code out of prServer.js to allow for easier testing.
 */
const app = require("./prServer");

const host = '127.0.1.10';
const port = '5555';
app.listen(port, host, function () {
    console.log("jsonServer1.js app listening on IPv4: " + host +
	":" + port);
});
