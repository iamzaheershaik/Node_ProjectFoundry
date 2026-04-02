/**
 * Basic Example — vibe-error-explainer
 *
 * Run: node examples/basic.js
 */

const { explainError, interceptErrors } = require('../index');

// ── Setup global error interception ──
interceptErrors({ offline: true, log: true });

// ── Example 1: Trigger a TypeError ──
console.log('\n🔥 Triggering a TypeError...\n');

const users = undefined;

try {
  // This will throw: TypeError: Cannot read properties of undefined (reading 'map')
  const names = users.map(u => u.name);
} catch (err) {
  // Explain it!
  explainError(err, { offline: true, mode: 'dev' });
}
