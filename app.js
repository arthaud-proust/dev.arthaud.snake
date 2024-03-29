require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const router = express.Router()
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';
//add the router folders

app.use(cors());

app.use(express.static(__dirname + '/public'));             // Store all assets, js and css files in public folder.
app.use(express.static(__dirname + '/resources/views'));    // Store all HTML files in view folder.

app.use('/', router);       // add the router

//routes and ioController
require('./resources/js/routes')(router);          
require('./resources/js/ioController')(io);
// });
io.sockets.on("error", e => console.log(e));


server.listen(PORT, HOST, () => console.log(`Server is running on port ${PORT}`));