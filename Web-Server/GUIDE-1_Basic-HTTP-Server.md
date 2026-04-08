# 🚀 Build Your Own Web Server From Scratch — The Spoon-Feeding Guide

## Part I: Make A Basic HTTP Server

> **How to use this guide:** Each chapter tells you EXACTLY what file to create, WHAT to type, and WHEN. Type every line yourself — no copy-paste. That's how you learn.

---

## 📁 Chapter 0: Project Setup

### What You're Doing
Setting up the project folder and initializing Node.js.

### Step 1: Open your terminal and run:
```bash
cd d:\Zaheer\Node_ProjectFoundry\Web-Server
npm init -y
```

### Step 2: Open `package.json` and verify it was created.

### Step 3: Create the folder structure
```
Web-Server/
├── package.json
├── 01-tcp-server/
├── 02-promises-events/
├── 03-simple-protocol/
├── 04-http-parser/
├── 05-http-server/
├── 06-dynamic-content/
├── 07-file-server/
├── 08-range-requests/
├── 09-caching/
├── 10-compression/
├── 11-websocket/
└── public/           ← static files for testing later
```

Run this to create all folders:
```bash
mkdir 01-tcp-server 02-promises-events 03-simple-protocol 04-http-parser 05-http-server 06-dynamic-content 07-file-server 08-range-requests 09-caching 10-compression 11-websocket public
```

✅ **Checkpoint:** You should see all folders created. Move on.

---

## 📖 Chapter 1: HTTP Overview (Theory — No Code Yet)

### What You Need To Understand Before Writing Any Code

**HTTP (HyperText Transfer Protocol)** is just a set of rules for how a client (browser) talks to a server. Here's the mental model:

```
┌──────────┐                          ┌──────────┐
│  CLIENT  │  ── HTTP Request ──►     │  SERVER  │
│ (Browser)│  ◄── HTTP Response ──    │ (Your    │
│          │                          │  Code!)  │
└──────────┘                          └──────────┘
```

### The Layered Model (Bottom to Top)
```
Layer 4: HTTP      ← The rules for web pages (what you'll build)
Layer 3: TCP       ← Reliable delivery of bytes (what carries HTTP)
Layer 2: IP        ← Routing packets across networks
Layer 1: Physical  ← Actual wires/wifi
```

> **Key Insight:** HTTP rides ON TOP of TCP. So to build an HTTP server, you first need to understand TCP. That's why we start there.

### HTTP Request Format (Memorize This!)
```
GET /index.html HTTP/1.1\r\n        ← Request Line (Method, Path, Version)
Host: localhost:3000\r\n             ← Header
User-Agent: Mozilla/5.0\r\n          ← Header
Accept: text/html\r\n                ← Header
\r\n                                  ← Empty line = END of headers
                                      ← Body (optional, empty for GET)
```

### HTTP Response Format (Memorize This!)
```
HTTP/1.1 200 OK\r\n                  ← Status Line (Version, Code, Reason)
Content-Type: text/html\r\n          ← Header
Content-Length: 13\r\n               ← Header
\r\n                                  ← Empty line = END of headers
Hello, World!                        ← Body
```

### Critical Detail: `\r\n` (CRLF)
- `\r` = Carriage Return (go to start of line)
- `\n` = Line Feed (go to next line)
- HTTP uses `\r\n` to end EVERY line
- A blank line (`\r\n\r\n`) separates headers from body

### Common Status Codes You'll Implement
| Code | Meaning | When to Use |
|------|---------|------------|
| 200 | OK | Request succeeded |
| 206 | Partial Content | Range request succeeded |
| 304 | Not Modified | Cache is still valid |
| 400 | Bad Request | Malformed request |
| 404 | Not Found | Resource doesn't exist |
| 416 | Range Not Satisfiable | Invalid range |
| 500 | Internal Server Error | Server broke |

✅ **Checkpoint:** You understand that HTTP = text messages over TCP. Now let's build the TCP layer.

---

## 🔧 Chapter 2: Code A TCP Server

### What You're Building
A raw TCP server using Node's built-in `net` module. No HTTP yet — just raw bytes flowing between client and server.

### Step 1: Create the file
Create file: `01-tcp-server/server.js`

### Step 2: Type this code (line by line, understand each line)

```javascript
// 01-tcp-server/server.js

// Import the 'net' module — this is Node's built-in TCP networking module
// It lets us create servers that send/receive raw bytes
const net = require('net');

// net.createServer() creates a new TCP server
// The callback fires every time a NEW client connects
// 'socket' represents the connection to THAT specific client
const server = net.createServer((socket) => {
    console.log('New client connected!');
    console.log('Client address:', socket.remoteAddress, ':', socket.remotePort);

    // 'data' event fires when the client SENDS us bytes
    socket.on('data', (data) => {
        // 'data' is a Buffer (raw bytes)
        // .toString() converts it to readable text
        console.log('Received:', data.toString());

        // Echo it back to the client
        socket.write('Server says: ' + data.toString());
    });

    // 'end' event fires when the client DISCONNECTS
    socket.on('end', () => {
        console.log('Client disconnected.');
    });

    // 'error' event fires on network errors
    // ALWAYS handle this or your server will CRASH
    socket.on('error', (err) => {
        console.error('Socket error:', err.message);
    });
});

// Start listening on port 3000
// '0.0.0.0' means accept connections from any network interface
server.listen(3000, '0.0.0.0', () => {
    console.log('TCP Server listening on port 3000');
});
```

### Step 3: Run it
```bash
node 01-tcp-server/server.js
```
You should see: `TCP Server listening on port 3000`

### Step 4: Test it (open a SECOND terminal)

**Option A — Using PowerShell (Windows):**
```powershell
# Connect to the TCP server
$client = New-Object System.Net.Sockets.TcpClient("localhost", 3000)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream)
$reader = New-Object System.IO.StreamReader($stream)
$writer.AutoFlush = $true
$writer.WriteLine("Hello from client!")
$reader.ReadLine()
$client.Close()
```

**Option B — Using Node.js as a client:**
Create file: `01-tcp-server/client.js`
```javascript
// 01-tcp-server/client.js
const net = require('net');

const client = net.createConnection({ port: 3000, host: 'localhost' }, () => {
    console.log('Connected to server!');
    client.write('Hello from Node client!');
});

client.on('data', (data) => {
    console.log('Server replied:', data.toString());
    client.end(); // disconnect after getting reply
});

client.on('end', () => {
    console.log('Disconnected from server.');
});
```
Run it: `node 01-tcp-server/client.js`

### What You Should See
**Server terminal:**
```
TCP Server listening on port 3000
New client connected!
Received: Hello from Node client!
Client disconnected.
```

**Client terminal:**
```
Connected to server!
Server replied: Server says: Hello from Node client!
Disconnected from server.
```

✅ **Checkpoint:** You have a working TCP server. You're sending raw bytes back and forth. HTTP hasn't entered the picture yet.

---

## 🔧 Chapter 3: Promises and Events

### What You're Building
Utility functions that wrap Node's event-driven sockets in Promises, so you can use `async/await` for cleaner code later.

### Why This Matters
Node's `net` module is **event-driven** (callbacks everywhere). But complex server logic is cleaner with `async/await`. You need a bridge.

### Step 1: Create the file
Create file: `02-promises-events/promise-socket.js`

### Step 2: Type this code

```javascript
// 02-promises-events/promise-socket.js

const net = require('net');
const { EventEmitter } = require('events');

// === UTILITY: Read exactly one message from a socket ===
// Wraps the 'data' event in a Promise
function socketRead(socket) {
    return new Promise((resolve, reject) => {
        // When data arrives, resolve the promise with it
        socket.once('data', (data) => {
            resolve(data);
        });

        // If an error happens, reject the promise
        socket.once('error', (err) => {
            reject(err);
        });

        // If the connection closes before data, resolve with null
        socket.once('end', () => {
            resolve(null);
        });
    });
}

// === UTILITY: Write data and wait until it's flushed ===
function socketWrite(socket, data) {
    return new Promise((resolve, reject) => {
        // socket.write() returns true if flushed immediately
        // If it returns false, we wait for the 'drain' event
        const flushed = socket.write(data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// === UTILITY: Wait for a server to start listening ===
function serverListen(server, port, host) {
    return new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, host, () => {
            server.removeListener('error', reject);
            resolve();
        });
    });
}

// === UTILITY: Accept one connection from a server ===
function serverAccept(server) {
    return new Promise((resolve) => {
        server.once('connection', (socket) => {
            resolve(socket);
        });
    });
}

// Export all utilities
module.exports = { socketRead, socketWrite, serverListen, serverAccept };
```

### Step 3: Test the utilities
Create file: `02-promises-events/test.js`

```javascript
// 02-promises-events/test.js
const net = require('net');
const { socketRead, socketWrite, serverListen, serverAccept } = require('./promise-socket');

async function main() {
    // Create a server
    const server = net.createServer();
    await serverListen(server, 3001, '0.0.0.0');
    console.log('Server listening on port 3001');

    // In parallel: accept a connection AND create a client
    const acceptPromise = serverAccept(server);

    const client = net.createConnection({ port: 3001, host: 'localhost' });

    // Wait for the server to accept
    const serverSocket = await acceptPromise;
    console.log('Server accepted a connection!');

    // Client sends a message
    await socketWrite(client, 'Hello via Promises!');
    console.log('Client sent message');

    // Server reads it
    const data = await socketRead(serverSocket);
    console.log('Server received:', data.toString());

    // Cleanup
    client.end();
    serverSocket.end();
    server.close();
    console.log('Test passed! ✅');
}

main().catch(console.error);
```

### Step 4: Run the test
```bash
node 02-promises-events/test.js
```

### Expected Output
```
Server listening on port 3001
Server accepted a connection!
Client sent message
Server received: Hello via Promises!
Test passed! ✅
```

✅ **Checkpoint:** You now have reusable async utilities for socket operations.

---

## 🔧 Chapter 4: A Simple Network Protocol

### What You're Building
A custom message protocol with **length-prefixed messages**. This solves TCP's biggest gotcha: **TCP doesn't preserve message boundaries**.

### The Problem
TCP is a STREAM of bytes. If you send "Hello" and then "World", the receiver might get:
- `"HelloWorld"` (merged)
- `"Hel"` then `"loWorld"` (split randomly)
- `"Hello"` then `"World"` (lucky)

### The Solution: Length Prefix
Prefix every message with its length (as a 4-byte integer):
```
[4 bytes: length][N bytes: message data]
[4 bytes: length][N bytes: message data]
...
```

### Step 1: Create the file
Create file: `03-simple-protocol/protocol.js`

### Step 2: Type this code

```javascript
// 03-simple-protocol/protocol.js

// === MESSAGE READER ===
// Accumulates bytes and extracts complete messages
class MessageReader {
    constructor() {
        // Buffer to accumulate incoming bytes
        this.buffer = Buffer.alloc(0);
        // Queue of complete messages
        this.messages = [];
    }

    // Call this every time you receive data from the socket
    push(data) {
        // Append new data to our buffer
        this.buffer = Buffer.concat([this.buffer, data]);

        // Try to extract as many complete messages as possible
        while (this.buffer.length >= 4) {
            // Read the length prefix (first 4 bytes, big-endian unsigned 32-bit)
            const messageLength = this.buffer.readUInt32BE(0);

            // Check if we have the full message yet
            if (this.buffer.length < 4 + messageLength) {
                break; // Need more data, wait for next chunk
            }

            // Extract the message (skip the 4-byte length prefix)
            const message = this.buffer.subarray(4, 4 + messageLength);
            this.messages.push(message);

            // Remove the processed bytes from the buffer
            this.buffer = this.buffer.subarray(4 + messageLength);
        }
    }

    // Get the next complete message (or null if none ready)
    pop() {
        if (this.messages.length === 0) {
            return null;
        }
        return this.messages.shift();
    }

    // Check if there are complete messages waiting
    hasMessage() {
        return this.messages.length > 0;
    }
}

// === MESSAGE WRITER ===
// Encodes a message with a length prefix
function encodeMessage(data) {
    // Convert string to Buffer if needed
    const payload = Buffer.isBuffer(data) ? data : Buffer.from(data);

    // Create a 4-byte header with the length
    const header = Buffer.alloc(4);
    header.writeUInt32BE(payload.length, 0);

    // Combine header + payload
    return Buffer.concat([header, payload]);
}

module.exports = { MessageReader, encodeMessage };
```

### Step 3: Test the protocol
Create file: `03-simple-protocol/test.js`

```javascript
// 03-simple-protocol/test.js
const net = require('net');
const { MessageReader, encodeMessage } = require('./protocol');
const { serverListen, serverAccept } = require('../02-promises-events/promise-socket');

async function main() {
    const server = net.createServer();
    await serverListen(server, 3002, '0.0.0.0');
    console.log('Protocol test server on port 3002');

    const acceptPromise = serverAccept(server);
    const client = net.createConnection({ port: 3002, host: 'localhost' });

    const serverSocket = await acceptPromise;
    const reader = new MessageReader();

    // Client sends TWO messages rapidly (they might arrive merged!)
    client.write(encodeMessage('First message'));
    client.write(encodeMessage('Second message'));

    // Server reads and parses
    serverSocket.on('data', (data) => {
        reader.push(data);
        while (reader.hasMessage()) {
            const msg = reader.pop();
            console.log('Got message:', msg.toString());
        }
    });

    // Wait a bit then cleanup
    setTimeout(() => {
        client.end();
        serverSocket.end();
        server.close();
        console.log('Protocol test passed! ✅');
    }, 500);
}

main().catch(console.error);
```

### Step 4: Run the test
```bash
node 03-simple-protocol/test.js
```

### Expected Output
```
Protocol test server on port 3002
Got message: First message
Got message: Second message
Protocol test passed! ✅
```

✅ **Checkpoint:** You now understand message framing — the foundation of ALL network protocols.

---

## 🔧 Chapter 5: HTTP Semantics and Syntax

### What You're Building
An HTTP request parser. This reads raw bytes from a TCP socket and extracts the method, path, headers, and body.

### Step 1: Create the file
Create file: `04-http-parser/http-parser.js`

### Step 2: Type this code

```javascript
// 04-http-parser/http-parser.js

// === HTTP REQUEST PARSER ===
// Parses raw HTTP request bytes into a structured object

class HTTPRequestParser {
    constructor() {
        this.buffer = Buffer.alloc(0);
    }

    // Append incoming data
    push(data) {
        this.buffer = Buffer.concat([this.buffer, data]);
    }

    // Check if we have a complete set of headers
    // Headers end with \r\n\r\n
    hasCompleteHeaders() {
        return this.buffer.includes('\r\n\r\n');
    }

    // Parse the request from the buffer
    // Returns { method, path, version, headers, body } or null
    parse() {
        if (!this.hasCompleteHeaders()) {
            return null; // Need more data
        }

        const raw = this.buffer.toString();

        // Split headers from body at the blank line
        const headerEndIndex = raw.indexOf('\r\n\r\n');
        const headerSection = raw.substring(0, headerEndIndex);
        const bodyRaw = raw.substring(headerEndIndex + 4);

        // Split header section into lines
        const lines = headerSection.split('\r\n');

        // Parse the REQUEST LINE (first line)
        // Format: "GET /path HTTP/1.1"
        const requestLine = lines[0];
        const [method, path, version] = requestLine.split(' ');

        // Parse HEADERS (remaining lines)
        // Format: "Header-Name: Header-Value"
        const headers = {};
        for (let i = 1; i < lines.length; i++) {
            const colonIndex = lines[i].indexOf(':');
            if (colonIndex === -1) continue; // skip malformed lines

            const name = lines[i].substring(0, colonIndex).trim().toLowerCase();
            const value = lines[i].substring(colonIndex + 1).trim();
            headers[name] = value;
        }

        // Determine body based on Content-Length
        let body = null;
        const contentLength = parseInt(headers['content-length'], 10);
        if (contentLength > 0) {
            if (bodyRaw.length < contentLength) {
                return null; // Body not fully received yet
            }
            body = bodyRaw.substring(0, contentLength);
        }

        return { method, path, version, headers, body };
    }
}

// === HTTP RESPONSE BUILDER ===
// Builds a properly formatted HTTP response string

function buildResponse(statusCode, statusText, headers, body) {
    // Status line
    let response = `HTTP/1.1 ${statusCode} ${statusText}\r\n`;

    // If there's a body, set Content-Length automatically
    if (body) {
        const bodyBuffer = Buffer.from(body);
        headers['Content-Length'] = bodyBuffer.length;
    }

    // Write headers
    for (const [name, value] of Object.entries(headers)) {
        response += `${name}: ${value}\r\n`;
    }

    // Blank line to end headers
    response += '\r\n';

    // Append body
    if (body) {
        response += body;
    }

    return response;
}

module.exports = { HTTPRequestParser, buildResponse };
```

### Step 3: Test the parser
Create file: `04-http-parser/test.js`

```javascript
// 04-http-parser/test.js
const { HTTPRequestParser, buildResponse } = require('./http-parser');

// Simulate a raw HTTP request (as if received from a browser)
const rawRequest =
    'GET /hello HTTP/1.1\r\n' +
    'Host: localhost:3000\r\n' +
    'User-Agent: TestClient/1.0\r\n' +
    'Accept: text/html\r\n' +
    '\r\n';

const parser = new HTTPRequestParser();
parser.push(Buffer.from(rawRequest));

const request = parser.parse();
console.log('Parsed request:');
console.log('  Method:', request.method);
console.log('  Path:', request.path);
console.log('  Version:', request.version);
console.log('  Headers:', request.headers);
console.log('  Body:', request.body);

// Test response builder
const response = buildResponse(200, 'OK', {
    'Content-Type': 'text/html',
    'Connection': 'close'
}, '<h1>Hello World</h1>');

console.log('\nBuilt response:');
console.log(response);
console.log('Parser test passed! ✅');
```

### Step 4: Run
```bash
node 04-http-parser/test.js
```

### Expected Output
```
Parsed request:
  Method: GET
  Path: /hello
  Version: HTTP/1.1
  Headers: { host: 'localhost:3000', 'user-agent': 'TestClient/1.0', accept: 'text/html' }
  Body: null

Built response:
HTTP/1.1 200 OK
Content-Type: text/html
Connection: close
Content-Length: 20

<h1>Hello World</h1>
Parser test passed! ✅
```

✅ **Checkpoint:** You can parse HTTP requests and build HTTP responses!

---

## 🔧 Chapter 6: Code A Basic HTTP Server

### What You're Building
A REAL HTTP server! Combining your TCP server + HTTP parser. Browsers will be able to connect to this.

### Step 1: Create the file
Create file: `05-http-server/server.js`

### Step 2: Type this code

```javascript
// 05-http-server/server.js

const net = require('net');
const { HTTPRequestParser, buildResponse } = require('../04-http-parser/http-parser');

// === ROUTE HANDLERS ===
// Define what happens for each URL path

const routes = {
    '/': (request) => {
        const html = `<!DOCTYPE html>
<html>
<head><title>My Web Server</title></head>
<body>
    <h1>🚀 Hello from your custom HTTP server!</h1>
    <p>You built this from scratch using raw TCP sockets.</p>
    <p>Method: ${request.method}</p>
    <p>Path: ${request.path}</p>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/json">JSON API</a></li>
    </ul>
</body>
</html>`;
        return buildResponse(200, 'OK', {
            'Content-Type': 'text/html',
            'Connection': 'close'
        }, html);
    },

    '/about': (request) => {
        const html = `<!DOCTYPE html>
<html>
<head><title>About</title></head>
<body>
    <h1>About This Server</h1>
    <p>Built from scratch with Node.js net module.</p>
    <p>No Express. No http module. Pure TCP.</p>
    <a href="/">← Back Home</a>
</body>
</html>`;
        return buildResponse(200, 'OK', {
            'Content-Type': 'text/html',
            'Connection': 'close'
        }, html);
    },

    '/json': (request) => {
        const data = JSON.stringify({
            message: 'Hello from your API!',
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.path
        }, null, 2);
        return buildResponse(200, 'OK', {
            'Content-Type': 'application/json',
            'Connection': 'close'
        }, data);
    }
};

// === THE SERVER ===

const server = net.createServer((socket) => {
    const parser = new HTTPRequestParser();

    socket.on('data', (data) => {
        parser.push(data);

        const request = parser.parse();
        if (!request) return; // Headers not complete yet

        console.log(`${request.method} ${request.path}`);

        // Find a matching route, or return 404
        const handler = routes[request.path];
        let response;

        if (handler) {
            response = handler(request);
        } else {
            response = buildResponse(404, 'Not Found', {
                'Content-Type': 'text/html',
                'Connection': 'close'
            }, '<h1>404 - Page Not Found</h1>');
        }

        socket.write(response);
        socket.end(); // Close the connection
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err.message);
    });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 HTTP Server running at http://localhost:${PORT}`);
    console.log('Open your browser and visit the URL above!');
});
```

### Step 3: Run it
```bash
node 05-http-server/server.js
```

### Step 4: Test in your BROWSER
Open: `http://localhost:3000`

You should see your HTML page with links! Click around. Try:
- `http://localhost:3000/`
- `http://localhost:3000/about`
- `http://localhost:3000/json`
- `http://localhost:3000/nonexistent` (should show 404)

✅ **Checkpoint:** You have a WORKING HTTP server built from raw TCP. Browsers can connect to it! **Part I is COMPLETE.**

---

## 🎉 Part I Complete!

### What You've Built So Far
```
TCP Server (raw bytes) 
    → Promise Utilities (async/await bridge)
        → Message Protocol (length-prefixed framing)
            → HTTP Parser (understands request/response format)
                → HTTP Server (handles routes, serves HTML/JSON)
```

### Your File Tree Should Look Like
```
Web-Server/
├── package.json
├── 01-tcp-server/
│   ├── server.js       ← Raw TCP echo server
│   └── client.js       ← TCP test client
├── 02-promises-events/
│   ├── promise-socket.js ← Async socket utilities
│   └── test.js          ← Test for utilities
├── 03-simple-protocol/
│   ├── protocol.js      ← Length-prefixed message framing
│   └── test.js          ← Test for protocol
├── 04-http-parser/
│   ├── http-parser.js   ← HTTP request parser + response builder
│   └── test.js          ← Test for parser
├── 05-http-server/
│   └── server.js        ← Your working HTTP server!
└── public/              ← (empty for now, used in Part II)
```

> **Continue to Part II** → [guide_part2.md](file:///C:/Users/mitud/.gemini/antigravity/brain/8ab2c214-3fb4-44c3-95a0-dce3fd7bb9fd/guide_part2.md) (Dynamic Content, File Serving, Range Requests, Caching, Compression, WebSocket)
