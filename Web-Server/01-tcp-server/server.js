const net = require('net');

const server = net.createServer((socket) => {
    console.log("New client connected");
    console.log('Client address :', socket.remoteAddress, ":", socket.remotePort);

    socket.on('data', (data) => {
        console.log('Received:', data.toString());
        socket.write("Server says: " + data.toString());
    });

    socket.on('end', () => {
        console.log("client disconnected.");
    });

    socket.on('error', (err) => {
        console.error('socket error', err.message);
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log("TCP Server listening on port 3000")
});