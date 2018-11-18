var socket = io();
socket.on('connect', function () {
    socket.emit('join', window.location.search, function (error) {
        if (error) {
            alert(error);
            window.location.href = '/';
        } else {
            console.log('no errors');
        }
    });
});

socket.on('disconnect', function () {
    console.log("Disconnected from the server");
});

socket.on('newMessage', function (message) {
    console.log("new Message", message);

    var node = document.createElement("li");
    //${message.createdAt} [${message.from}]: 
    var textnode = document.createTextNode(`${message.text}`);
    node.appendChild(textnode);
    document.getElementById("messages").appendChild(node);
});

document.getElementById('message-form').addEventListener('submit', function (e) {
    e.preventDefault();

    onSendMessage();
});

onSendMessage = () => {
    socket.emit('createMessage', {
        text: document.getElementById('txtInput').value,
        createdAt: new Date().getTime()
    }, txtInput.value = "" );
}
