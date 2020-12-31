require('dotenv').config();
const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const router = express.Router()
const PORT = process.env.PORT || 8000;

//add the router folders
app.use(express.static(__dirname + '/public'));             // Store all assets, js and css files in public folder.
app.use(express.static(__dirname + '/resources/views'));    // Store all HTML files in view folder.

app.use('/', router);       // add the router

//routes and ioController
require('./resources/js/routes')(router);          
require('./resources/js/ioController')(io);
// });
io.sockets.on("error", e => console.log(e));


server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));