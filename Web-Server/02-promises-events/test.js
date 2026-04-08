const net = require('net');
const {socketRead, socketWrite, serverListen, serverAccept} = require('./promise-socket');

async function main(){
    const server = net.createServer();
    await serverListen(server, 3001, '0.0.0.0');
    console.log('Server listening on port 3001')

    const acceptPromise = serverAccept(server);
    const client = net.createConnection({port:3001, host:'localhost'});

    const serverSocket = await acceptPromise;
    console.log("Server accepted a connection");

    await  socketWrite(client, "Hello via Promises");
    console.log("Client sent message");

    const data  = await socketRead(serverSocket);
    console.log('Server received: ', data.toString());

    client.end();
    serverSocket.end();
    server.close();
    console.log("Test Passed")
}

main().catch(console.error())