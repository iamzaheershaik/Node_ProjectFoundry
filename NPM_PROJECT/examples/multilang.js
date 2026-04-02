/**
 * Multi-Language Example — vibe-error-explainer
 *
 * Run: node examples/multilang.js
 *
 * Demonstrates error explanation in Hindi, Telugu, and Tamil
 * Note: Requires ANTHROPIC_API_KEY for AI translations. Falls back to offline (English) otherwise.
 */

const { explainError } = require('../index');

async function main() {
  const error = new TypeError("Cannot read properties of undefined (reading 'map')");

  console.log('\n══════════════════════════════════════');
  console.log('  🌍 Multi-Language Error Explanations');
  console.log('══════════════════════════════════════\n');

  // English (works offline)
  console.log('📝 English:\n');
  await explainError(error, { offline: true, mode: 'dev' });

  // Hindi (needs API key for translation)
  console.log('\n📝 Hindi:\n');
  await explainError(error, { lang: 'hindi', mode: 'dev' });

  // Telugu (needs API key for translation)
  console.log('\n📝 Telugu:\n');
  await explainError(error, { lang: 'telugu', mode: 'dev' });
}

main().catch(console.error);
