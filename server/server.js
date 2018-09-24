const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
var {generateMessage} = require('./utils/message');

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath));

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cadavre-exquis-215311.firebaseio.com"
});


io.on('connection', (socket) => {
    console.log("New user connected");

    socket.emit('newMessage', generateMessage('Server', 'Hello User'));

    socket.broadcast.emit('newMessage', generateMessage('Server', 'New user joined'));

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('disconnect', (socket) => {
        console.log("User disconnected");
    })
});

server.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
