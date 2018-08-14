const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New user connected");

    socket.emit('newMessage', {
        from: 'Server',
        text: 'Hello User',
        createdAt: new Date().toLocaleTimeString()
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: message.createdAt
        });
    });

    socket.on('disconnect', (socket) => {
        console.log("User disconnected");
    })
});

server.listen(port, () => {
    console.log(`app listening on port ${port}`);
});