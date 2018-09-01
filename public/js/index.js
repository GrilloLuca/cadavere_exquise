var socket = io();
socket.on('connect', function () {
    console.log("Connected to the server");
});

socket.on('disconnect', function () {
    console.log("Disconnected from the server");
});

socket.on('newMessage', function (message) {
    console.log("new Message", message);

    var node = document.createElement("P"); 
    var textnode = document.createTextNode(`${message.createdAt} [${message.from}]: ${message.text}`);
    node.appendChild(textnode);
    document.getElementById("messages").appendChild(node);
    
});

onSendMessage = () => {
    var txtInput = document.getElementById('txtInput');
    let message = txtInput.value;
    socket.emit('createMessage', {from: 'user', text: message, createdAt: new Date().toLocaleTimeString()});
    txtInput.value = "";
}