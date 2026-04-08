# 🚀 Build Your Own Web Server From Scratch — Part II

## Part II: Applications & Extensions

> **Prerequisite:** Complete Part I first. Each chapter here builds on top of your existing code.

---

## 🔧 Chapter 7: Dynamic Content and Streaming

### What You're Building
Extend your server to handle POST requests with body data, and stream responses in chunks.

### Step 1: Create the file
Create file: `06-dynamic-content/server.js`

### Step 2: Type this code

```javascript
// 06-dynamic-content/server.js

const net = require('net');
const { HTTPRequestParser, buildResponse } = require('../04-http-parser/http-parser');

// In-memory data store (like a mini database)
const messages = [];

function handleRequest(request) {
    // === POST /messages — Add a new message ===
    if (request.method === 'POST' && request.path === '/messages') {
        try {
            const data = JSON.parse(request.body);
            messages.push({
                id: messages.length + 1,
                text: data.text,
                createdAt: new Date().toISOString()
            });
            return buildResponse(201, 'Created', {
                'Content-Type': 'application/json',
                'Connection': 'close'
            }, JSON.stringify({ success: true, count: messages.length }));
        } catch (e) {
            return buildResponse(400, 'Bad Request', {
                'Content-Type': 'application/json',
                'Connection': 'close'
            }, JSON.stringify({ error: 'Invalid JSON' }));
        }
    }

    // === GET /messages — List all messages ===
    if (request.method === 'GET' && request.path === '/messages') {
        return buildResponse(200, 'OK', {
            'Content-Type': 'application/json',
            'Connection': 'close'
        }, JSON.stringify(messages, null, 2));
    }

    // === GET / — Home page with form ===
    if (request.path === '/') {
        const html = `<!DOCTYPE html>
<html><head><title>Dynamic Server</title></head>
<body>
<h1>📝 Message Board</h1>
<form id="form">
    <input type="text" id="msg" placeholder="Type a message..." />
    <button type="submit">Send</button>
</form>
<div id="messages"></div>
<script>
    async function loadMessages() {
        const res = await fetch('/messages');
        const msgs = await res.json();
        document.getElementById('messages').innerHTML =
            msgs.map(m => '<p><b>#' + m.id + '</b> ' + m.text +
            ' <small>(' + m.createdAt + ')</small></p>').join('');
    }
    document.getElementById('form').onsubmit = async (e) => {
        e.preventDefault();
        const text = document.getElementById('msg').value;
        await fetch('/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        document.getElementById('msg').value = '';
        loadMessages();
    };
    loadMessages();
</script>
</body></html>`;
        return buildResponse(200, 'OK', {
            'Content-Type': 'text/html',
            'Connection': 'close'
        }, html);
    }

    return buildResponse(404, 'Not Found', {
        'Content-Type': 'text/html',
        'Connection': 'close'
    }, '<h1>404</h1>');
}

const server = net.createServer((socket) => {
    const parser = new HTTPRequestParser();

    socket.on('data', (data) => {
        parser.push(data);
        const request = parser.parse();
        if (!request) return;

        console.log(`${request.method} ${request.path}`);
        const response = handleRequest(request);
        socket.write(response);
        socket.end();
    });

    socket.on('error', (err) => console.error('Error:', err.message));
});

server.listen(3000, () => {
    console.log('🚀 Dynamic server at http://localhost:3000');
});
```

### Step 3: Run and test
```bash
node 06-dynamic-content/server.js
```
Open `http://localhost:3000` — you'll see a message board. Type messages and submit!

✅ **Checkpoint:** Your server handles GET and POST, parses JSON bodies, and serves dynamic content.

---

## 🔧 Chapter 8: File IO & Resource Management

### What You're Building
A static file server that serves files from the `public/` directory.

### Step 1: Create test files in `public/`

Create file: `public/index.html`
```html
<!DOCTYPE html>
<html>
<head><title>Static Site</title>
<link rel="stylesheet" href="/style.css">
</head>
<body>
<h1>🌐 Served from the file system!</h1>
<p>This HTML file was read from disk by your custom server.</p>
<img src="/logo.txt" alt="logo placeholder">
</body>
</html>
```

Create file: `public/style.css`
```css
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    background: #1a1a2e;
    color: #e0e0e0;
}
h1 { color: #00d4ff; }
```

### Step 2: Create the file server
Create file: `07-file-server/server.js`

### Step 3: Type this code

```javascript
// 07-file-server/server.js

const net = require('net');
const fs = require('fs');
const path = require('path');
const { HTTPRequestParser, buildResponse } = require('../04-http-parser/http-parser');

// Root directory for static files
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Map file extensions to MIME types
const MIME_TYPES = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.txt':  'text/plain',
    '.ico':  'image/x-icon',
};

function serveFile(request, socket) {
    // Construct the file path
    let filePath = request.path;
    if (filePath === '/') filePath = '/index.html'; // default document

    // SECURITY: Prevent directory traversal attacks!
    // Resolve the path and make sure it's inside PUBLIC_DIR
    const fullPath = path.resolve(PUBLIC_DIR, '.' + filePath);
    if (!fullPath.startsWith(PUBLIC_DIR)) {
        const response = buildResponse(403, 'Forbidden', {
            'Content-Type': 'text/html',
            'Connection': 'close'
        }, '<h1>403 Forbidden</h1>');
        socket.write(response);
        socket.end();
        return;
    }

    // Check if file exists
    fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
            const response = buildResponse(404, 'Not Found', {
                'Content-Type': 'text/html',
                'Connection': 'close'
            }, '<h1>404 - File Not Found</h1>');
            socket.write(response);
            socket.end();
            return;
        }

        // Determine MIME type
        const ext = path.extname(fullPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Build response headers
        const headers =
            `HTTP/1.1 200 OK\r\n` +
            `Content-Type: ${contentType}\r\n` +
            `Content-Length: ${stats.size}\r\n` +
            `Connection: close\r\n` +
            `\r\n`;

        // Write headers first
        socket.write(headers);

        // STREAM the file body (don't load entire file into memory!)
        const fileStream = fs.createReadStream(fullPath);
        fileStream.pipe(socket); // pipe connects readable → writable

        fileStream.on('error', (err) => {
            console.error('File read error:', err.message);
            socket.end();
        });
    });
}

const server = net.createServer((socket) => {
    const parser = new HTTPRequestParser();

    socket.on('data', (data) => {
        parser.push(data);
        const request = parser.parse();
        if (!request) return;

        console.log(`${request.method} ${request.path}`);
        serveFile(request, socket);
    });

    socket.on('error', (err) => console.error('Error:', err.message));
});

server.listen(3000, () => {
    console.log('📁 File server at http://localhost:3000');
    console.log('Serving files from:', PUBLIC_DIR);
});
```

### Step 4: Run and test
```bash
node 07-file-server/server.js
```
Open `http://localhost:3000` — you'll see your styled HTML page, loaded from disk!

✅ **Checkpoint:** You're streaming files from disk. The `pipe()` call is key — it handles backpressure automatically.

---

## 🔧 Chapter 9: Range Requests

### What You're Building
Support for `Range` headers — lets clients request partial file downloads (essential for video streaming & download resume).

### Step 1: Create a test file
```bash
node -e "require('fs').writeFileSync('public/sample.txt', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz')"
```

### Step 2: Create the file
Create file: `08-range-requests/server.js`

### Step 3: Type this code

```javascript
// 08-range-requests/server.js

const net = require('net');
const fs = require('fs');
const path = require('path');
const { HTTPRequestParser } = require('../04-http-parser/http-parser');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME_TYPES = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.txt': 'text/plain',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4',
};

function serveFile(request, socket) {
    let filePath = request.path === '/' ? '/index.html' : request.path;
    const fullPath = path.resolve(PUBLIC_DIR, '.' + filePath);

    if (!fullPath.startsWith(PUBLIC_DIR)) {
        socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
        socket.end();
        return;
    }

    fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
            socket.write('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n<h1>404</h1>');
            socket.end();
            return;
        }

        const ext = path.extname(fullPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const totalSize = stats.size;
        const rangeHeader = request.headers['range'];

        if (rangeHeader) {
            // === RANGE REQUEST ===
            // Parse "bytes=START-END"
            const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
            if (!match) {
                socket.write('HTTP/1.1 416 Range Not Satisfiable\r\n' +
                    `Content-Range: bytes */${totalSize}\r\n` +
                    'Connection: close\r\n\r\n');
                socket.end();
                return;
            }

            const start = parseInt(match[1], 10);
            const end = match[2] ? parseInt(match[2], 10) : totalSize - 1;

            // Validate range
            if (start >= totalSize || end >= totalSize || start > end) {
                socket.write('HTTP/1.1 416 Range Not Satisfiable\r\n' +
                    `Content-Range: bytes */${totalSize}\r\n` +
                    'Connection: close\r\n\r\n');
                socket.end();
                return;
            }

            const chunkSize = end - start + 1;

            // Send 206 Partial Content
            const headers =
                `HTTP/1.1 206 Partial Content\r\n` +
                `Content-Range: bytes ${start}-${end}/${totalSize}\r\n` +
                `Accept-Ranges: bytes\r\n` +
                `Content-Length: ${chunkSize}\r\n` +
                `Content-Type: ${contentType}\r\n` +
                `Connection: close\r\n\r\n`;

            socket.write(headers);
            fs.createReadStream(fullPath, { start, end }).pipe(socket);

            console.log(`  → 206 bytes ${start}-${end}/${totalSize}`);
        } else {
            // === FULL REQUEST ===
            const headers =
                `HTTP/1.1 200 OK\r\n` +
                `Accept-Ranges: bytes\r\n` +
                `Content-Length: ${totalSize}\r\n` +
                `Content-Type: ${contentType}\r\n` +
                `Connection: close\r\n\r\n`;

            socket.write(headers);
            fs.createReadStream(fullPath).pipe(socket);
        }
    });
}

const server = net.createServer((socket) => {
    const parser = new HTTPRequestParser();
    socket.on('data', (data) => {
        parser.push(data);
        const request = parser.parse();
        if (!request) return;
        console.log(`${request.method} ${request.path}`);
        serveFile(request, socket);
    });
    socket.on('error', (err) => console.error('Error:', err.message));
});

server.listen(3000, () => console.log('📡 Range server at http://localhost:3000'));
```

### Step 4: Test with curl
```bash
node 08-range-requests/server.js
```
```bash
# Full request
curl http://localhost:3000/sample.txt

# Range request — get bytes 0-9
curl -H "Range: bytes=0-9" http://localhost:3000/sample.txt
# Output: ABCDEFGHIJ

# Range request — get bytes 10-19
curl -H "Range: bytes=10-19" http://localhost:3000/sample.txt
# Output: KLMNOPQRST
```

✅ **Checkpoint:** Your server supports partial downloads!

---

## 🔧 Chapter 10: HTTP Caching

### What You're Building
Add `ETag`, `Last-Modified`, and `Cache-Control` headers. Return `304 Not Modified` when the client already has the current version.

### Step 1: Create the file
Create file: `09-caching/server.js`

### Step 2: Type this code

```javascript
// 09-caching/server.js

const net = require('net');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { HTTPRequestParser } = require('../04-http-parser/http-parser');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIME_TYPES = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.txt': 'text/plain', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg',
};

// Generate an ETag from file content
function generateETag(content) {
    const hash = crypto.createHash('md5').update(content).digest('hex');
    return `"${hash}"`;
}

function serveFile(request, socket) {
    let filePath = request.path === '/' ? '/index.html' : request.path;
    const fullPath = path.resolve(PUBLIC_DIR, '.' + filePath);

    if (!fullPath.startsWith(PUBLIC_DIR)) {
        socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
        return socket.end();
    }

    fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
            socket.write('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n<h1>404</h1>');
            return socket.end();
        }

        // Read file to generate ETag
        fs.readFile(fullPath, (err, content) => {
            if (err) {
                socket.write('HTTP/1.1 500 Internal Server Error\r\nConnection: close\r\n\r\n');
                return socket.end();
            }

            const etag = generateETag(content);
            const lastModified = stats.mtime.toUTCString();
            const ext = path.extname(fullPath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            // === CHECK CACHE VALIDATION ===
            const clientETag = request.headers['if-none-match'];
            const clientModified = request.headers['if-modified-since'];

            if (clientETag === etag || clientModified === lastModified) {
                // Client already has current version!
                console.log(`  → 304 Not Modified`);
                socket.write(
                    'HTTP/1.1 304 Not Modified\r\n' +
                    `ETag: ${etag}\r\n` +
                    `Last-Modified: ${lastModified}\r\n` +
                    'Connection: close\r\n\r\n'
                );
                return socket.end();
            }

            // === SEND FULL RESPONSE WITH CACHE HEADERS ===
            console.log(`  → 200 OK (with cache headers)`);
            const headers =
                `HTTP/1.1 200 OK\r\n` +
                `Content-Type: ${contentType}\r\n` +
                `Content-Length: ${content.length}\r\n` +
                `ETag: ${etag}\r\n` +
                `Last-Modified: ${lastModified}\r\n` +
                `Cache-Control: public, max-age=3600\r\n` +
                `Connection: close\r\n\r\n`;

            socket.write(headers);
            socket.write(content);
            socket.end();
        });
    });
}

const server = net.createServer((socket) => {
    const parser = new HTTPRequestParser();
    socket.on('data', (data) => {
        parser.push(data);
        const request = parser.parse();
        if (!request) return;
        console.log(`${request.method} ${request.path}`);
        serveFile(request, socket);
    });
    socket.on('error', (err) => console.error('Error:', err.message));
});

server.listen(3000, () => console.log('💾 Caching server at http://localhost:3000'));
```

### Step 3: Test
```bash
node 09-caching/server.js
```
```bash
# First request — gets 200 with ETag
curl -v http://localhost:3000/sample.txt

# Second request with ETag — gets 304!
curl -v -H 'If-None-Match: "<paste-etag-from-above>"' http://localhost:3000/sample.txt
```

✅ **Checkpoint:** Your server sends 304s, saving bandwidth!

---

## 🔧 Chapter 11: Compression & the Stream API

### What You're Building
Gzip compression using Node's `zlib` module. The server checks `Accept-Encoding` and compresses responses.

### Step 1: Create the file
Create file: `10-compression/server.js`

### Step 2: Type this code

```javascript
// 10-compression/server.js

const net = require('net');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { HTTPRequestParser } = require('../04-http-parser/http-parser');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIME_TYPES = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.txt': 'text/plain', '.json': 'application/json',
};

// Only compress text-based types
const COMPRESSIBLE = ['.html', '.css', '.js', '.txt', '.json', '.svg'];

function serveFile(request, socket) {
    let filePath = request.path === '/' ? '/index.html' : request.path;
    const fullPath = path.resolve(PUBLIC_DIR, '.' + filePath);

    if (!fullPath.startsWith(PUBLIC_DIR)) {
        socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
        return socket.end();
    }

    fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
            socket.write('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n<h1>404</h1>');
            return socket.end();
        }

        const ext = path.extname(fullPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Check if client accepts gzip
        const acceptEncoding = request.headers['accept-encoding'] || '';
        const supportsGzip = acceptEncoding.includes('gzip');
        const isCompressible = COMPRESSIBLE.includes(ext);

        if (supportsGzip && isCompressible) {
            // === COMPRESSED RESPONSE ===
            // Use Transfer-Encoding: chunked (we don't know compressed size upfront)
            const headers =
                `HTTP/1.1 200 OK\r\n` +
                `Content-Type: ${contentType}\r\n` +
                `Content-Encoding: gzip\r\n` +
                `Transfer-Encoding: chunked\r\n` +
                `Connection: close\r\n\r\n`;

            socket.write(headers);

            const fileStream = fs.createReadStream(fullPath);
            const gzipStream = zlib.createGzip();

            // Manual chunked encoding
            gzipStream.on('data', (chunk) => {
                // Chunked format: SIZE_IN_HEX\r\n DATA \r\n
                socket.write(chunk.length.toString(16) + '\r\n');
                socket.write(chunk);
                socket.write('\r\n');
            });

            gzipStream.on('end', () => {
                // Final chunk: 0\r\n\r\n
                socket.write('0\r\n\r\n');
                socket.end();
            });

            fileStream.pipe(gzipStream); // file → gzip → manual chunked → socket
            console.log(`  → 200 OK (gzip compressed)`);
        } else {
            // === UNCOMPRESSED RESPONSE ===
            const headers =
                `HTTP/1.1 200 OK\r\n` +
                `Content-Type: ${contentType}\r\n` +
                `Content-Length: ${stats.size}\r\n` +
                `Connection: close\r\n\r\n`;

            socket.write(headers);
            fs.createReadStream(fullPath).pipe(socket);
            console.log(`  → 200 OK (no compression)`);
        }
    });
}

const server = net.createServer((socket) => {
    const parser = new HTTPRequestParser();
    socket.on('data', (data) => {
        parser.push(data);
        const request = parser.parse();
        if (!request) return;
        console.log(`${request.method} ${request.path}`);
        serveFile(request, socket);
    });
    socket.on('error', (err) => console.error('Error:', err.message));
});

server.listen(3000, () => console.log('🗜️ Compression server at http://localhost:3000'));
```

### Step 3: Test
```bash
node 10-compression/server.js
```
```bash
# Without compression
curl http://localhost:3000/sample.txt

# With compression
curl --compressed -H "Accept-Encoding: gzip" http://localhost:3000/sample.txt
```

✅ **Checkpoint:** Your server compresses responses, saving bandwidth!

---

## 🔧 Chapter 12: WebSocket & Concurrency

### What You're Building
A WebSocket server — real-time bidirectional communication over a single TCP connection. This is the BOSS LEVEL.

### Step 1: Create the file
Create file: `11-websocket/server.js`

### Step 2: Type this code

```javascript
// 11-websocket/server.js

const net = require('net');
const crypto = require('crypto');
const { HTTPRequestParser } = require('../04-http-parser/http-parser');

// The magic string from RFC 6455 — this NEVER changes
const WS_MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

// All connected WebSocket clients
const clients = new Set();

// === WEBSOCKET HANDSHAKE ===
function handleUpgrade(request, socket) {
    const key = request.headers['sec-websocket-key'];
    if (!key) {
        socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
        socket.end();
        return false;
    }

    // Generate accept key: SHA1(client_key + magic_string) → base64
    const acceptKey = crypto
        .createHash('sha1')
        .update(key + WS_MAGIC_STRING)
        .digest('base64');

    // Send the 101 Switching Protocols response
    socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n' +
        `Sec-WebSocket-Accept: ${acceptKey}\r\n` +
        '\r\n'
    );

    return true;
}

// === DECODE A WEBSOCKET FRAME ===
function decodeFrame(buffer) {
    if (buffer.length < 2) return null;

    const firstByte = buffer[0];
    const secondByte = buffer[1];

    const fin = (firstByte & 0x80) !== 0;     // Is this the final fragment?
    const opcode = firstByte & 0x0F;           // Frame type
    const isMasked = (secondByte & 0x80) !== 0;// Client frames MUST be masked
    let payloadLength = secondByte & 0x7F;     // Payload length (7 bits)

    let offset = 2; // Current read position

    // Extended payload length
    if (payloadLength === 126) {
        if (buffer.length < 4) return null;
        payloadLength = buffer.readUInt16BE(2);
        offset = 4;
    } else if (payloadLength === 127) {
        if (buffer.length < 10) return null;
        // For simplicity, only handle up to 32-bit lengths
        payloadLength = Number(buffer.readBigUInt64BE(2));
        offset = 10;
    }

    // Read the masking key (4 bytes)
    let maskKey = null;
    if (isMasked) {
        if (buffer.length < offset + 4) return null;
        maskKey = buffer.subarray(offset, offset + 4);
        offset += 4;
    }

    // Read the payload
    if (buffer.length < offset + payloadLength) return null;
    const payload = buffer.subarray(offset, offset + payloadLength);

    // Unmask the payload (XOR each byte with the mask key)
    if (isMasked && maskKey) {
        for (let i = 0; i < payload.length; i++) {
            payload[i] = payload[i] ^ maskKey[i % 4];
        }
    }

    return {
        fin,
        opcode,
        payload,
        totalLength: offset + payloadLength
    };
}

// === ENCODE A WEBSOCKET FRAME ===
function encodeFrame(data, opcode = 0x01) {
    const payload = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const length = payload.length;

    let header;
    if (length < 126) {
        header = Buffer.alloc(2);
        header[0] = 0x80 | opcode; // FIN + opcode
        header[1] = length;
    } else if (length < 65536) {
        header = Buffer.alloc(4);
        header[0] = 0x80 | opcode;
        header[1] = 126;
        header.writeUInt16BE(length, 2);
    } else {
        header = Buffer.alloc(10);
        header[0] = 0x80 | opcode;
        header[1] = 127;
        header.writeBigUInt64BE(BigInt(length), 2);
    }

    return Buffer.concat([header, payload]);
}

// Broadcast a message to all connected clients
function broadcast(message, sender) {
    const frame = encodeFrame(message);
    for (const client of clients) {
        if (client !== sender && !client.destroyed) {
            client.write(frame);
        }
    }
}

// === MAIN SERVER ===
const server = net.createServer((socket) => {
    let upgraded = false;
    let wsBuffer = Buffer.alloc(0);
    const parser = new HTTPRequestParser();

    socket.on('data', (data) => {
        if (!upgraded) {
            // Phase 1: HTTP handshake
            parser.push(data);
            const request = parser.parse();
            if (!request) return;

            if (request.headers['upgrade'] === 'websocket') {
                // WebSocket upgrade request
                upgraded = handleUpgrade(request, socket);
                if (upgraded) {
                    clients.add(socket);
                    console.log(`WebSocket client connected (${clients.size} total)`);
                    // Send welcome message
                    socket.write(encodeFrame('Welcome to the WebSocket server!'));
                }
            } else {
                // Serve the chat page
                const html = `<!DOCTYPE html>
<html><head><title>WebSocket Chat</title>
<style>
body { font-family: Arial; max-width: 600px; margin: 40px auto; background: #0d1117; color: #c9d1d9; }
#messages { height: 300px; overflow-y: auto; border: 1px solid #30363d; padding: 10px; margin-bottom: 10px; border-radius: 6px; }
input { width: 80%; padding: 8px; background: #161b22; color: #c9d1d9; border: 1px solid #30363d; border-radius: 6px; }
button { padding: 8px 16px; background: #238636; color: white; border: none; border-radius: 6px; cursor: pointer; }
.msg { margin: 4px 0; padding: 4px 8px; background: #161b22; border-radius: 4px; }
</style></head>
<body>
<h1>💬 WebSocket Chat</h1>
<div id="messages"></div>
<input type="text" id="input" placeholder="Type a message..." />
<button onclick="send()">Send</button>
<script>
const ws = new WebSocket('ws://localhost:3000');
const msgs = document.getElementById('messages');
ws.onmessage = (e) => {
    const div = document.createElement('div');
    div.className = 'msg';
    div.textContent = e.data;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
};
ws.onopen = () => { msgs.innerHTML += '<div class="msg"><i>Connected!</i></div>'; };
function send() {
    const input = document.getElementById('input');
    if (input.value) { ws.send(input.value); input.value = ''; }
}
document.getElementById('input').onkeydown = (e) => { if (e.key === 'Enter') send(); };
</script>
</body></html>`;

                socket.write(
                    `HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n` +
                    `Content-Length: ${Buffer.from(html).length}\r\n` +
                    `Connection: close\r\n\r\n` + html
                );
                socket.end();
            }
        } else {
            // Phase 2: WebSocket binary frames
            wsBuffer = Buffer.concat([wsBuffer, data]);

            while (wsBuffer.length > 0) {
                const frame = decodeFrame(wsBuffer);
                if (!frame) break;

                wsBuffer = wsBuffer.subarray(frame.totalLength);

                if (frame.opcode === 0x01) {
                    // Text frame
                    const message = frame.payload.toString();
                    console.log('Message:', message);
                    // Echo to sender + broadcast to others
                    socket.write(encodeFrame('You: ' + message));
                    broadcast('Someone: ' + message, socket);
                } else if (frame.opcode === 0x08) {
                    // Close frame
                    socket.write(encodeFrame('', 0x08)); // close acknowledgment
                    socket.end();
                } else if (frame.opcode === 0x09) {
                    // Ping — respond with Pong
                    socket.write(encodeFrame(frame.payload, 0x0A));
                }
            }
        }
    });

    socket.on('close', () => {
        clients.delete(socket);
        console.log(`Client disconnected (${clients.size} remaining)`);
    });

    socket.on('error', (err) => console.error('Error:', err.message));
});

server.listen(3000, () => {
    console.log('💬 WebSocket server at http://localhost:3000');
    console.log('Open multiple browser tabs to chat!');
});
```

### Step 3: Run and test
```bash
node 11-websocket/server.js
```
Open `http://localhost:3000` in TWO browser tabs. Type messages in both — they appear in real-time!

✅ **Checkpoint:** You built a real-time WebSocket chat server from raw TCP. 🎉

---

# 🏆 Final Project Structure
```
Web-Server/
├── package.json
├── 01-tcp-server/
│   ├── server.js          ← Ch2: Raw TCP echo server
│   └── client.js          ← Ch2: TCP test client
├── 02-promises-events/
│   ├── promise-socket.js  ← Ch3: Async socket utilities
│   └── test.js
├── 03-simple-protocol/
│   ├── protocol.js        ← Ch4: Length-prefixed framing
│   └── test.js
├── 04-http-parser/
│   ├── http-parser.js     ← Ch5: HTTP parser + response builder
│   └── test.js
├── 05-http-server/
│   └── server.js          ← Ch6: Basic HTTP server with routes
├── 06-dynamic-content/
│   └── server.js          ← Ch7: POST handling + dynamic content
├── 07-file-server/
│   └── server.js          ← Ch8: Static file server with streaming
├── 08-range-requests/
│   └── server.js          ← Ch9: 206 Partial Content
├── 09-caching/
│   └── server.js          ← Ch10: ETag + Last-Modified + 304
├── 10-compression/
│   └── server.js          ← Ch11: Gzip + chunked encoding
├── 11-websocket/
│   └── server.js          ← Ch12: WebSocket + real-time chat
└── public/
    ├── index.html
    ├── style.css
    └── sample.txt
```

> **Congratulations!** You've built an HTTP server from raw TCP sockets, with file serving, caching, compression, range requests, and WebSocket support — all from scratch! 🚀
