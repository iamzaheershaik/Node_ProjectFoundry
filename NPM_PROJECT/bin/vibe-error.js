#!/usr/bin/env node

/**
 * vibe-error CLI
 * 
 * Usage:
 *   vibe-error "TypeError: Cannot read properties of undefined"
 *   vibe-error --lang hindi "TypeError: ..."
 *   vibe-error --watch "node server.js"
 *   vibe-error --stats
 *   vibe-error --offline "TypeError: ..."
 *   vibe-error --help
 *   vibe-error --languages
 */

const path = require('path');
const chalk = require('chalk');

// Parse CLI arguments
const args = process.argv.slice(2);

// ── Help ──
if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  printHelp();
  process.exit(0);
}

// ── Languages list ──
if (args.includes('--languages') || args.includes('--langs')) {
  const { getLanguageList } = require('../src/features/languages');
  console.log('');
  console.log(chalk.bold.cyan('  🌍 SUPPORTED LANGUAGES'));
  console.log(chalk.gray('  ─'.repeat(35)));
  console.log(getLanguageList());
  console.log('');
  process.exit(0);
}

// ── Stats ──
if (args.includes('--stats')) {
  const { loadConfig } = require('../src/config/config');
  const { getErrorStats, printStats } = require('../src/features/errorStats');
  const config = loadConfig();
  const stats = getErrorStats(config.logFile);
  printStats(stats);
  process.exit(0);
}

// ── Clear log ──
if (args.includes('--clear')) {
  const { loadConfig } = require('../src/config/config');
  const { clearErrorLog } = require('../src/features/errorHistory');
  const config = loadConfig();
  clearErrorLog(config.logFile);
  console.log(chalk.green('\n  ✅ Error log cleared.\n'));
  process.exit(0);
}

// ── Parse flags ──
let lang = null;
let offline = false;
let watchCmd = null;
let logToFile = false;
let errorInput = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--lang' || arg === '-l') {
    lang = args[i + 1];
    i++; // skip next arg (the language value)
  } else if (arg === '--offline' || arg === '-o') {
    offline = true;
  } else if (arg === '--log') {
    logToFile = true;
  } else if (arg === '--watch' || arg === '-w') {
    watchCmd = args[i + 1];
    i++; // skip next arg (the command)
  } else if (!arg.startsWith('-')) {
    errorInput = arg;
  }
}

// ── Watch Mode ──
if (watchCmd) {
  const { startWatchMode } = require('../src/features/watchMode');
  startWatchMode(watchCmd, {
    lang: lang || 'en',
    offline,
    log: true, // always log in watch mode
  });
  // watch mode runs indefinitely
} else if (errorInput) {
  // ── Explain Error ──
  const { explainError } = require('../src/pipeline');

  (async () => {
    try {
      await explainError(errorInput, {
        lang: lang || undefined,
        offline,
        log: logToFile,
      });
    } catch (err) {
      console.error(chalk.red(`\n  ❌ ${err.message}\n`));
      process.exit(1);
    }
  })();
} else {
  printHelp();
  process.exit(0);
}

function printHelp() {
  console.log(`
${chalk.bold.cyan('  🔥 VIBE ERROR EXPLAINER')}
${chalk.gray('  ─'.repeat(35))}
  ${chalk.bold('Errors, explained like a friend 🤝')}

  ${chalk.bold.yellow('USAGE:')}

    ${chalk.green('vibe-error')} ${chalk.white('"TypeError: Cannot read properties..."')}
    ${chalk.green('vibe-error')} ${chalk.cyan('--lang hindi')} ${chalk.white('"TypeError: ..."')}
    ${chalk.green('vibe-error')} ${chalk.cyan('--watch')} ${chalk.white('"node server.js"')}
    ${chalk.green('vibe-error')} ${chalk.cyan('--stats')}
    ${chalk.green('vibe-error')} ${chalk.cyan('--offline')} ${chalk.white('"TypeError: ..."')}

  ${chalk.bold.yellow('FLAGS:')}

    ${chalk.cyan('--lang, -l')}      ${chalk.gray('Language for explanation (hindi, telugu, tamil, urdu, ...)')}
    ${chalk.cyan('--watch, -w')}     ${chalk.gray('Watch mode — restart & explain errors automatically')}
    ${chalk.cyan('--offline, -o')}   ${chalk.gray('Use offline dictionary (no API key needed)')}
    ${chalk.cyan('--stats')}         ${chalk.gray('Show error frequency stats from log')}
    ${chalk.cyan('--log')}           ${chalk.gray('Save explanation to vibe-errors.log')}
    ${chalk.cyan('--clear')}         ${chalk.gray('Clear the error log')}
    ${chalk.cyan('--languages')}     ${chalk.gray('List all supported languages')}
    ${chalk.cyan('--help, -h')}      ${chalk.gray('Show this help message')}

  ${chalk.bold.yellow('SETUP:')}

    ${chalk.gray('1.')} Create a ${chalk.white('.env')} file with your API key:
       ${chalk.dim('GOOGLE_API_KEY=your-google-api-key-here')}

    ${chalk.gray('2.')} Or use offline mode (no API key needed):
       ${chalk.dim('vibe-error --offline "TypeError: ..."')}

  ${chalk.gray(`  v1.0.0 | github.com/your-username/vibe-error-explainer`)}
  `);
}
