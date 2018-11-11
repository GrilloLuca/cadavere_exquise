const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const queryString = require('query-string');
const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'cadavre-exquis-215311',
  keyFilename: 'server/serviceAccountKey.json',
});

var { generateMessage } = require('./utils/message');
var { isRealString } = require('./utils/validator');
var { Users } = require('./utils/users');

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath));

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cadavre-exquis-215311.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("server/messages");


var story = firestore.collection('story');

io.on('connection', (socket) => {
    console.log("New user connected");

    story.get()
        .then(snapshot => {
        snapshot.forEach(doc => {
            doc.data().messages.forEach(msg => {

                firestore.collection('messages').doc(msg.id).get()
                    .then(doc => {
                        if (!doc.exists) {
                        console.log('No such document!');
                        } else {
                            var message = doc.data();
                            var user = users.getUser(socket.id);
                            io.to(user.room).emit('newMessage', generateMessage(message.created_by, `${message.text}`));
                        }
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                    });
            });
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

    
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();

        var dbMessages = ref.child(`/${message.createdAt}/`);
        dbMessages.set(message);
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        console.log(`User ${user.name} has left`);
        if (user) {
            io.to(user.room).emit('newMessage', generateMessage('Server', `${user.name} has left`));
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        }
    });

    socket.on('join', (params, callback) => {

        const parsed = queryString.parse(params);
        if (!isRealString(parsed.name)) {
            callback('valid nickname required');
        }

        const room = 'cadavre exquis';
        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, parsed.name, room);
        io.to(room).emit('updateUserList', users.getUserList(room));

        socket.emit('newMessage', generateMessage('Server', `Hello ${parsed.name}`));

        socket.broadcast.to(room).emit('newMessage', generateMessage('Server', `${parsed.name} joined the room`));

    })
});

server.listen(port, () => {
    console.log(`app listening on port ${port}`);
});

