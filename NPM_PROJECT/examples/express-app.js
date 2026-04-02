/**
 * Express Example — vibe-error-explainer
 *
 * Run: node examples/express-app.js
 * Then hit: http://localhost:3333/crash
 */

let express;
try {
  express = require('express');
} catch {
  console.log('⚠️  Express not installed. Run: npm install express');
  console.log('   Then run this example again.\n');
  process.exit(0);
}

const { vibeErrorMiddleware } = require('../index');

const app = express();

// ── Normal route ──
app.get('/', (req, res) => {
  res.json({ message: '✅ Server is running! Try hitting /crash' });
});

// ── Route that intentionally crashes ──
app.get('/crash', (req, res) => {
  const users = undefined;
  // This will throw TypeError: Cannot read properties of undefined (reading 'map')
  const names = users.map(u => u.name);
  res.json(names);
});

// ── Route with a different error ──
app.get('/bad-id', (req, res) => {
  const mongoose = { Types: { ObjectId: { isValid: () => false } } };
  throw new Error('Cast to ObjectId failed for value "not-a-real-id"');
});

// ── Vibe Error Middleware (must be AFTER all routes) ──
app.use(vibeErrorMiddleware({
  mode: 'dev',
  log: true,
  offline: true, // Use offline mode for this demo (no API key needed)
}));

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`\n🚀 Express demo running on http://localhost:${PORT}`);
  console.log(`   Try these routes:`);
  console.log(`   → http://localhost:${PORT}/       (success)`);
  console.log(`   → http://localhost:${PORT}/crash   (TypeError — explained!)`);
  console.log(`   → http://localhost:${PORT}/bad-id  (MongoDB error — explained!)`);
  console.log('');
});
