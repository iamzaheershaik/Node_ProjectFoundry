const net = require('net');
const {EvenEmitter} = require('events');

function socketRead(socket){
    return new Promise((resolve, reject ) => {
        socket.once('data', (data) => {
            resolve(data)
        });
        socket.once('error', (err) =>{
            reject(err);
        })
        socket.once('end', () =>{
            resolve(null);
        })
    })
}

function socketWrite(socket,data){
    return new Promise((resolve, reject) => {
        const flushed = socket.write(data, (err) =>{
            if(err){
                reject(err);
            }else{
                resolve();
            }
        })
    })
}
function serverListen(server, port, host){
    return new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, host, () => {
            server.removeListener('error', reject);
            resolve();
        })
    })
}

function serverAccept(server){
    return new Promise((resolve) =>{
        server.once('connection', (socket) =>{
            resolve(socket)
        })
    })
}

module.exports ={socketRead, socketWrite, serverListen, serverAccept};