/**
 * Offline Error Dictionary
 * 50+ common JavaScript/Node.js errors explained in plain English
 * Works without any API key
 */

const errorDictionary = [
  // ═══════════════════════════════════════════════
  // TypeError
  // ═══════════════════════════════════════════════
  {
    pattern: /Cannot read propert(y|ies) of undefined/i,
    type: 'TypeError',
    explanation: "You're trying to access a property on something that is `undefined`. This usually means a variable hasn't been assigned yet, or a function returned nothing when you expected an object.",
    fix: "Check if the variable exists before accessing its property. Use optional chaining: `obj?.property` or add a null check: `if (obj) { ... }`",
    fixCode: "// Before:\nobj.property\n\n// After (Option 1 — optional chaining):\nobj?.property\n\n// After (Option 2 — null check):\nif (obj) {\n  obj.property\n}",
    confidence: 95,
  },
  {
    pattern: /Cannot read propert(y|ies) of null/i,
    type: 'TypeError',
    explanation: "You're trying to access a property on `null`. The variable exists but was explicitly set to `null`, or a function like `document.getElementById()` returned `null` because the element wasn't found.",
    fix: "Add a null check before accessing the property, or verify the value is being set correctly.",
    fixCode: "// Before:\nresult.data\n\n// After:\nif (result !== null) {\n  result.data\n}",
    confidence: 93,
  },
  {
    pattern: /(\w+) is not a function/i,
    type: 'TypeError',
    explanation: "You're trying to call something as a function, but it's not a function. This commonly happens when: (1) you misspelled the function name, (2) you imported it wrong, or (3) the variable holds a different type like a string or object.",
    fix: "Check the spelling, verify the import/require statement, and make sure the variable is actually a function.",
    fixCode: "// Common cause — wrong import:\nconst { myFunc } = require('./module');\n// Make sure 'myFunc' is actually exported from that module",
    confidence: 88,
  },
  {
    pattern: /Cannot set propert(y|ies) of undefined/i,
    type: 'TypeError',
    explanation: "You're trying to set a property on something that is `undefined`. The parent object doesn't exist yet.",
    fix: "Initialize the parent object first before setting properties on it.",
    fixCode: "// Before:\nobj.nested.value = 42;\n\n// After:\nobj.nested = obj.nested || {};\nobj.nested.value = 42;",
    confidence: 92,
  },
  {
    pattern: /Assignment to constant variable/i,
    type: 'TypeError',
    explanation: "You declared a variable with `const` but then tried to change its value. `const` means the variable can't be reassigned.",
    fix: "Use `let` instead of `const` if you need to reassign the variable.",
    fixCode: "// Before:\nconst count = 0;\ncount = 1; // ❌ Error!\n\n// After:\nlet count = 0;\ncount = 1; // ✅ Works!",
    confidence: 98,
  },
  {
    pattern: /(\w+)\.map is not a function/i,
    type: 'TypeError',
    explanation: "You're trying to use `.map()` on something that isn't an array. The variable might be `undefined`, `null`, an object, or a string instead of an array.",
    fix: "Make sure the variable is actually an array before calling `.map()`. Use a fallback empty array.",
    fixCode: "// Before:\ndata.map(item => item.name)\n\n// After:\n(data || []).map(item => item.name)\n\n// Or with Array check:\nArray.isArray(data) ? data.map(item => item.name) : []",
    confidence: 94,
  },
  {
    pattern: /(\w+)\.forEach is not a function/i,
    type: 'TypeError',
    explanation: "You're trying to use `.forEach()` on something that isn't an array. Similar to `.map()`, the variable might not be an array.",
    fix: "Ensure the variable is an array before calling `.forEach()`. Use `Array.isArray()` to check.",
    fixCode: "// Before:\nitems.forEach(item => console.log(item))\n\n// After:\n(items || []).forEach(item => console.log(item))",
    confidence: 94,
  },
  {
    pattern: /Cannot destructure property/i,
    type: 'TypeError',
    explanation: "You're trying to destructure (unpack) properties from something that is `undefined` or `null`. The source you're destructuring from doesn't exist.",
    fix: "Add a default value when destructuring, or check if the source exists.",
    fixCode: "// Before:\nconst { name, age } = getUser();\n\n// After (with defaults):\nconst { name, age } = getUser() || {};",
    confidence: 91,
  },
  {
    pattern: /spread a non-iterable/i,
    type: 'TypeError',
    explanation: "You're using the spread operator (`...`) on something that can't be spread — like `undefined`, `null`, or a number. Only arrays, strings, and other iterables can be spread.",
    fix: "Check that the value is iterable before spreading it.",
    fixCode: "// Before:\nconst merged = [...data];\n\n// After:\nconst merged = [...(data || [])];",
    confidence: 90,
  },

  // ═══════════════════════════════════════════════
  // ReferenceError
  // ═══════════════════════════════════════════════
  {
    pattern: /(\w+) is not defined/i,
    type: 'ReferenceError',
    explanation: "You're using a variable or function that hasn't been declared anywhere. Either you forgot to declare it with `let`/`const`/`var`, you misspelled it, or forgot to import/require it.",
    fix: "Declare the variable, fix the spelling, or add the missing import/require statement.",
    fixCode: "// Common fix — missing import:\nconst missingModule = require('./path/to/module');\n\n// Or declare the variable:\nlet myVariable = 'some value';",
    confidence: 90,
  },
  {
    pattern: /Cannot access '(\w+)' before initialization/i,
    type: 'ReferenceError',
    explanation: "You're trying to use a variable before the line where it's declared. With `let` and `const`, you can't use a variable before its declaration (this is called the 'temporal dead zone').",
    fix: "Move the variable declaration above where you first use it.",
    fixCode: "// Before:\nconsole.log(name); // ❌ Error!\nconst name = 'Zaheer';\n\n// After:\nconst name = 'Zaheer';\nconsole.log(name); // ✅ Works!",
    confidence: 96,
  },

  // ═══════════════════════════════════════════════
  // SyntaxError
  // ═══════════════════════════════════════════════
  {
    pattern: /Unexpected token/i,
    type: 'SyntaxError',
    explanation: "There's something in your code that JavaScript didn't expect — usually a missing comma, bracket, parenthesis, or you used the wrong syntax. It could also mean you're trying to parse invalid JSON.",
    fix: "Check for missing commas, unmatched brackets `{}` `[]` `()`, or typos near the line mentioned.",
    fixCode: "// Common causes:\n// 1. Missing comma in object: { a: 1 b: 2 } → { a: 1, b: 2 }\n// 2. Extra comma: [1, 2, 3,] → [1, 2, 3]\n// 3. Invalid JSON: JSON.parse('{name: \"test\"}') → JSON.parse('{\"name\": \"test\"}')",
    confidence: 75,
  },
  {
    pattern: /Unexpected end of input/i,
    type: 'SyntaxError',
    explanation: "Your code ended before JavaScript expected it to. This usually means you're missing a closing bracket `}`, parenthesis `)`, or bracket `]`.",
    fix: "Check that every opening `{`, `(`, and `[` has a matching closing one. Use your editor's bracket matching feature.",
    fixCode: "// Before:\nfunction hello() {\n  console.log('hi')\n// ← Missing closing }\n\n// After:\nfunction hello() {\n  console.log('hi')\n}",
    confidence: 85,
  },
  {
    pattern: /Unexpected identifier/i,
    type: 'SyntaxError',
    explanation: "JavaScript found a word or name where it didn't expect one. This is often caused by a missing comma, semicolon, or operator between two values.",
    fix: "Check the line for missing punctuation between values or statements.",
    confidence: 78,
  },

  // ═══════════════════════════════════════════════
  // RangeError
  // ═══════════════════════════════════════════════
  {
    pattern: /Maximum call stack size exceeded/i,
    type: 'RangeError',
    explanation: "Your code has infinite recursion — a function keeps calling itself forever until the computer runs out of memory. This usually means a recursive function is missing its exit condition (base case).",
    fix: "Add a base case to your recursive function that stops the recursion.",
    fixCode: "// Before (infinite recursion):\nfunction countdown(n) {\n  countdown(n - 1); // never stops!\n}\n\n// After (with base case):\nfunction countdown(n) {\n  if (n <= 0) return; // ✅ Stop condition\n  countdown(n - 1);\n}",
    confidence: 95,
  },
  {
    pattern: /Invalid array length/i,
    type: 'RangeError',
    explanation: "You tried to create an array with an invalid length — like a negative number or a number larger than 2^32 - 1.",
    fix: "Make sure the array length is a non-negative integer within bounds.",
    confidence: 92,
  },

  // ═══════════════════════════════════════════════
  // Node.js System Errors
  // ═══════════════════════════════════════════════
  {
    pattern: /ECONNREFUSED/i,
    type: 'SystemError',
    explanation: "The connection was refused — the server you're trying to connect to isn't running or isn't accepting connections. This commonly happens when your database (MongoDB, PostgreSQL, Redis) isn't started.",
    fix: "Start the server/database you're trying to connect to. Check if the port number and host are correct.",
    fixCode: "// If MongoDB is not running, start it:\n// $ mongod\n// or\n// $ sudo systemctl start mongod\n\n// If it's a custom server, check the port:\n// Is the server listening on the same port you're connecting to?",
    confidence: 92,
  },
  {
    pattern: /ENOENT.*no such file or directory/i,
    type: 'SystemError',
    explanation: "The file or directory you're trying to access doesn't exist. Either the path is wrong, the file hasn't been created yet, or it was deleted.",
    fix: "Double-check the file path. Make sure the file exists. Use `path.resolve()` or `path.join()` for reliable paths.",
    fixCode: "// Check if file exists first:\nconst fs = require('fs');\nif (fs.existsSync(filePath)) {\n  // read the file\n} else {\n  console.log('File not found:', filePath);\n}",
    confidence: 94,
  },
  {
    pattern: /EADDRINUSE/i,
    type: 'SystemError',
    explanation: "The port you're trying to use is already taken by another application. You can't have two servers listening on the same port.",
    fix: "Either stop the other application using that port, or choose a different port.",
    fixCode: "// Find what's using the port (Linux/Mac):\n// $ lsof -i :3000\n// $ kill -9 <PID>\n\n// Or use a different port:\nconst PORT = process.env.PORT || 3001;",
    confidence: 96,
  },
  {
    pattern: /EACCES.*permission denied/i,
    type: 'SystemError',
    explanation: "You don't have permission to access this file or port. This happens when trying to use ports below 1024 without root privileges, or accessing files owned by another user.",
    fix: "Use `sudo` for privileged ports, change file permissions with `chmod`, or use a port above 1024.",
    confidence: 90,
  },
  {
    pattern: /ETIMEDOUT/i,
    type: 'SystemError',
    explanation: "The connection timed out — the server you're trying to reach took too long to respond. This could mean the server is down, overloaded, or you have internet/network issues.",
    fix: "Check your network connection, verify the server URL, and try increasing the timeout value.",
    confidence: 85,
  },
  {
    pattern: /ENOTFOUND/i,
    type: 'SystemError',
    explanation: "The hostname couldn't be resolved — the domain name you're trying to connect to doesn't exist or DNS couldn't find it. Check if you typed the URL correctly.",
    fix: "Verify the hostname/URL is correct. Check your internet connection. If using a local service, make sure it's running.",
    confidence: 90,
  },

  // ═══════════════════════════════════════════════
  // Module Errors
  // ═══════════════════════════════════════════════
  {
    pattern: /Cannot find module '(.+?)'/i,
    type: 'ModuleError',
    explanation: "Node.js can't find the module you're trying to import. Either the package isn't installed, the file path is wrong, or you misspelled the module name.",
    fix: "Run `npm install <package-name>` if it's an npm package, or check the file path if it's a local module.",
    fixCode: "// If it's an npm package:\n// $ npm install <package-name>\n\n// If it's a local file, check the path:\nconst myModule = require('./correct/path/to/module');",
    confidence: 93,
  },
  {
    pattern: /require\(\) of ES Module/i,
    type: 'ModuleError',
    explanation: "You're trying to use `require()` to load an ES Module (a package that uses `import/export`). Some newer packages are ESM-only and can't be loaded with `require()`.",
    fix: "Either use `import()` dynamically, or switch your project to ESM by adding `\"type\": \"module\"` to your package.json.",
    fixCode: "// Option 1: Dynamic import\nconst module = await import('package-name');\n\n// Option 2: Add to package.json\n// { \"type\": \"module\" }\n// Then use: import package from 'package-name';",
    confidence: 90,
  },

  // ═══════════════════════════════════════════════
  // Express / HTTP Errors
  // ═══════════════════════════════════════════════
  {
    pattern: /Cannot (GET|POST|PUT|DELETE|PATCH) \//i,
    type: 'HTTPError',
    explanation: "The route you're trying to access doesn't exist in your Express app. Either the route hasn't been defined, or you're using the wrong HTTP method (GET vs POST).",
    fix: "Check your route definitions. Make sure the URL path and HTTP method match what you're requesting.",
    fixCode: "// Make sure you have:\napp.get('/your-route', (req, res) => {\n  res.json({ message: 'It works!' });\n});",
    confidence: 88,
  },
  {
    pattern: /argument handler is required/i,
    type: 'ExpressError',
    explanation: "An Express route is missing its handler function. You probably defined a route but forgot to pass the callback function, or the imported controller function is `undefined`.",
    fix: "Make sure every route has a valid handler function. Check your controller imports.",
    fixCode: "// Before (handler missing):\nrouter.post('/login', undefined); // ❌\n\n// After:\nrouter.post('/login', (req, res) => {\n  // handle login\n});",
    confidence: 95,
  },
  {
    pattern: /Cannot set headers after they are sent/i,
    type: 'ExpressError',
    explanation: "You're trying to send a response twice in the same request. After calling `res.send()`, `res.json()`, or `res.redirect()`, you can't send another response.",
    fix: "Add `return` after sending a response to prevent the code from continuing.",
    fixCode: "// Before:\nif (error) {\n  res.status(400).json({ error });\n  // code continues! ❌\n}\nres.json({ success: true });\n\n// After:\nif (error) {\n  return res.status(400).json({ error }); // ✅ return stops execution\n}\nres.json({ success: true });",
    confidence: 94,
  },

  // ═══════════════════════════════════════════════
  // MongoDB / Mongoose Errors
  // ═══════════════════════════════════════════════
  {
    pattern: /E11000 duplicate key error/i,
    type: 'MongoError',
    explanation: "You're trying to save a document with a value that already exists in a field marked as `unique`. For example, two users with the same email address.",
    fix: "Check for existing records before saving, or handle the duplicate error gracefully.",
    fixCode: "// Check first:\nconst existing = await User.findOne({ email });\nif (existing) {\n  return res.status(409).json({ error: 'Email already exists' });\n}\nawait User.create({ email, name });",
    confidence: 95,
  },
  {
    pattern: /Cast to ObjectId failed/i,
    type: 'MongoError',
    explanation: "You passed an invalid ID to MongoDB. MongoDB ObjectIDs are 24-character hex strings. You might be passing an empty string, wrong parameter, or a malformed ID.",
    fix: "Validate the ID before using it. Check that the URL parameter is correct.",
    fixCode: "const mongoose = require('mongoose');\nif (!mongoose.Types.ObjectId.isValid(id)) {\n  return res.status(400).json({ error: 'Invalid ID' });\n}",
    confidence: 93,
  },
  {
    pattern: /buffering timed out after \d+ms/i,
    type: 'MongoError',
    explanation: "Mongoose tried to perform an operation but isn't connected to MongoDB yet. The database connection hasn't been established or timed out.",
    fix: "Make sure MongoDB is running and your connection string is correct. Await the connection before performing queries.",
    fixCode: "// Make sure you connect first:\nawait mongoose.connect('mongodb://localhost:27017/mydb');\nconsole.log('MongoDB connected!');\n// THEN start your server",
    confidence: 91,
  },

  // ═══════════════════════════════════════════════
  // JSON Errors
  // ═══════════════════════════════════════════════
  {
    pattern: /Unexpected token .* in JSON at position/i,
    type: 'JSONError',
    explanation: "You're trying to parse invalid JSON. The string isn't valid JSON format — maybe it has trailing commas, unquoted keys, or is actually HTML/text instead of JSON.",
    fix: "Check the raw string before parsing. Make sure it's valid JSON with double-quoted keys and no trailing commas.",
    fixCode: "// Debug: see what you're actually parsing\nconsole.log('Raw data:', typeof data, data);\n\n// Safe parse:\ntry {\n  const parsed = JSON.parse(data);\n} catch (e) {\n  console.log('Invalid JSON received');\n}",
    confidence: 88,
  },

  // ═══════════════════════════════════════════════
  // Async / Promise Errors
  // ═══════════════════════════════════════════════
  {
    pattern: /await is only valid in async function/i,
    type: 'SyntaxError',
    explanation: "You used `await` inside a function that isn't marked as `async`. The `await` keyword can only be used inside `async` functions.",
    fix: "Add the `async` keyword before the function that contains `await`.",
    fixCode: "// Before:\nfunction getData() {\n  const data = await fetch('/api'); // ❌\n}\n\n// After:\nasync function getData() {\n  const data = await fetch('/api'); // ✅\n}",
    confidence: 98,
  },
  {
    pattern: /callback is not a function/i,
    type: 'TypeError',
    explanation: "A function expected a callback function as an argument, but received something else (like `undefined`). You either forgot to pass the callback or passed the wrong argument.",
    fix: "Make sure you're passing a function as the callback argument.",
    confidence: 88,
  },

  // ═══════════════════════════════════════════════
  // JWT / Auth Errors
  // ═══════════════════════════════════════════════
  {
    pattern: /jwt (must be provided|malformed|expired|invalid)/i,
    type: 'AuthError',
    explanation: "There's a problem with the JSON Web Token (JWT). It's either missing, expired, or has been tampered with. This usually means the user isn't logged in or their session expired.",
    fix: "Login again to get a fresh token. Make sure you're sending the token in the Authorization header.",
    fixCode: "// Send token in header:\nfetch('/api/data', {\n  headers: {\n    'Authorization': `Bearer ${token}`\n  }\n})",
    confidence: 90,
  },
  {
    pattern: /secretOrPrivateKey must have a value/i,
    type: 'AuthError',
    explanation: "Your JWT secret key is missing or undefined. It's probably not set in your environment variables.",
    fix: "Set the JWT_SECRET in your .env file and make sure dotenv loads it.",
    fixCode: "// .env file:\nJWT_SECRET=your-super-secret-key-here\n\n// In your code:\nrequire('dotenv').config();\nconst token = jwt.sign(payload, process.env.JWT_SECRET);",
    confidence: 95,
  },

  // ═══════════════════════════════════════════════
  // Miscellaneous Common Errors
  // ═══════════════════════════════════════════════
  {
    pattern: /undefined is not an object/i,
    type: 'TypeError',
    explanation: "You're trying to use `undefined` as an object — accessing properties or calling methods on it. The variable hasn't been set yet.",
    fix: "Check where the variable is supposed to get its value. Add a null/undefined check.",
    confidence: 88,
  },
  {
    pattern: /null is not an object/i,
    type: 'TypeError',
    explanation: "You're trying to use `null` as an object. The value exists but was explicitly set to null or a function returned null.",
    fix: "Add a null check before accessing properties.",
    confidence: 88,
  },
  {
    pattern: /fetch is not defined/i,
    type: 'ReferenceError',
    explanation: "The `fetch` API isn't available. In Node.js versions below 18, `fetch` doesn't exist by default. You need to install a package like `node-fetch`.",
    fix: "Upgrade to Node.js 18+ or install `node-fetch`.",
    fixCode: "// Option 1: Install node-fetch\n// $ npm install node-fetch\nconst fetch = require('node-fetch');\n\n// Option 2: Upgrade Node.js to 18+\n// fetch is built-in from Node 18 onwards",
    confidence: 94,
  },
  {
    pattern: /port \d+ is already in use/i,
    type: 'SystemError',
    explanation: "Another process is already using this port. You can't start two servers on the same port.",
    fix: "Kill the process using the port or use a different port.",
    fixCode: "// Find the process:\n// $ lsof -i :3000\n// $ kill -9 <PID>\n\n// Or use a different port:\nconst PORT = process.env.PORT || 3001;",
    confidence: 95,
  },
  {
    pattern: /ERR_HTTP_HEADERS_SENT/i,
    type: 'ExpressError',
    explanation: "You're trying to send HTTP headers after they've already been sent. This means you're sending two responses for one request.",
    fix: "Use `return` when sending responses to prevent further execution.",
    confidence: 94,
  },
  {
    pattern: /Unexpected end of JSON input/i,
    type: 'SyntaxError',
    explanation: "You're trying to parse JSON, but the string is empty or got cut off before the JSON was complete.",
    fix: "Check that you're receiving complete data before parsing. Log the raw response to see what you actually got.",
    fixCode: "// Safe JSON parse:\nconst text = await response.text();\nconsole.log('Raw response:', text);\nconst data = text ? JSON.parse(text) : {};",
    confidence: 87,
  },
  {
    pattern: /request entity too large/i,
    type: 'ExpressError',
    explanation: "The data you're sending in the request body is too large. Express has a default body size limit (usually 100kb).",
    fix: "Increase the body parser limit in your Express configuration.",
    fixCode: "// Increase the limit:\napp.use(express.json({ limit: '50mb' }));\napp.use(express.urlencoded({ limit: '50mb', extended: true }));",
    confidence: 93,
  },
  {
    pattern: /CORS/i,
    type: 'CORSError',
    explanation: "Cross-Origin Resource Sharing (CORS) is blocking your request. Your frontend is on a different domain/port than your backend, and the backend hasn't enabled CORS.",
    fix: "Install and configure the `cors` middleware in your Express app.",
    fixCode: "// $ npm install cors\nconst cors = require('cors');\napp.use(cors()); // allows all origins\n\n// Or be specific:\napp.use(cors({ origin: 'http://localhost:3000' }));",
    confidence: 92,
  },
];

/**
 * Find the best offline explanation for an error
 * @param {object} parsedError - Parsed error from parser.js
 * @returns {object|null} Matching dictionary entry or null
 */
function findOfflineExplanation(parsedError) {
  const errorString = `${parsedError.type}: ${parsedError.message}`;

  for (const entry of errorDictionary) {
    if (entry.pattern.test(errorString) || entry.pattern.test(parsedError.message)) {
      return {
        explanation: entry.explanation,
        fixedCode: entry.fixCode || null,
        fix: entry.fix || null,
        confidence: entry.confidence || 70,
        isOffline: true,
      };
    }
  }

  return null;
}

/**
 * Get a generic fallback explanation
 */
function getGenericExplanation(parsedError) {
  return {
    explanation: `A ${parsedError.type} occurred: ${parsedError.message}. This means something in your code didn't work as expected. Check the file and line number above for clues.`,
    fixedCode: null,
    fix: "Review the error message carefully, check the code at the mentioned line, and make sure all variables are defined and have the expected types.",
    confidence: 30,
    isOffline: true,
  };
}

module.exports = {
  findOfflineExplanation,
  getGenericExplanation,
  errorDictionary,
};
