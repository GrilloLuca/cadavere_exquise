
var socket = io();
socket.on('connect', function () {
    console.log("Connected to the server");
});

socket.on('disconnect', function () {
    console.log("Disconnected from the server");
});

socket.on('newMessage', function (message) {
    console.log("new Message", message);

    var node = document.createElement("li"); 
    var textnode = document.createTextNode(`${message.createdAt} [${message.from}]: ${message.text}`);
    node.appendChild(textnode);
    document.getElementById("messages").appendChild(node);
    
});

document.getElementById('message-form').addEventListener('submit', function(e) {
    e.preventDefault();

    onSendMessage();
});


onSendMessage = () => {
    socket.emit('createMessage', {
        from: 'user', 
        text: document.getElementById('txtInput').value, 
        createdAt: new Date().getTime()
    }, function(data) {
        txtInput.value = "";
    });
}
