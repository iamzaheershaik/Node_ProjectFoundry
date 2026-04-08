const net = require('net');
const client = net.createConnection({port: 3000, host:"localhost"}, () =>{
    console.log("connected to server");
    client.write("Hello from Node client")
})
client.on('data', (data) => {
    console.log("server replied:", data.toString());
    client.end();
})
client.on('end', () =>{
    console.log('Disconnected from server')
})