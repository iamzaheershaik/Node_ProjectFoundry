const chalk = require('chalk');

/**
 * Terminal Formatter
 * Beautiful, colorful output for error explanations
 */

const DIVIDER = chalk.gray('─'.repeat(70));
const THIN_DIVIDER = chalk.gray('┄'.repeat(70));

/**
 * Format and print a complete error explanation to the terminal
 * @param {object} result - The full explanation result
 */
function printExplanation(result) {
  const {
    parsed,
    codeContext,
    explanation,
    fixedCode,
    confidence,
    language,
    isOffline,
    resources,
  } = result;

  console.log('');
  console.log(DIVIDER);
  console.log(chalk.bold.red(`  💥 ${parsed.type}: `) + chalk.white(parsed.message));
  console.log(DIVIDER);

  // ── File Location ──
  if (parsed.file && parsed.line) {
    console.log('');
    console.log(
      chalk.bold.cyan('  📍 WHERE: ') +
      chalk.yellow(parsed.file) +
      chalk.gray(' → Line ') +
      chalk.bold.yellow(parsed.line) +
      (parsed.column ? chalk.gray(`:${parsed.column}`) : '')
    );
    if (parsed.functionName && parsed.functionName !== '<anonymous>') {
      console.log(chalk.gray(`          in function: `) + chalk.magenta(parsed.functionName));
    }
  }

  // ── Code Snippet ──
  if (codeContext) {
    console.log('');
    console.log(chalk.bold.cyan('  📄 CODE:'));
    console.log(chalk.gray('  ┌' + '─'.repeat(66)));
    const lines = formatCodeLines(codeContext);
    console.log(lines);
    console.log(chalk.gray('  └' + '─'.repeat(66)));
  }

  // ── Explanation ──
  if (explanation) {
    console.log('');
    console.log(chalk.bold.green('  🧠 WHAT HAPPENED:'));
    const wrapped = wrapText(explanation, 64);
    wrapped.forEach(line => {
      console.log(chalk.white(`     ${line}`));
    });
  }

  // ── Fix Suggestion ──
  if (fixedCode) {
    console.log('');
    console.log(chalk.bold.yellow('  ✅ SUGGESTED FIX:'));
    console.log(chalk.gray('  ┌' + '─'.repeat(66)));
    fixedCode.split('\n').forEach(line => {
      console.log(chalk.green(`  │ ${line}`));
    });
    console.log(chalk.gray('  └' + '─'.repeat(66)));
  }

  // ── Confidence ──
  if (confidence !== undefined) {
    console.log('');
    const icon = confidence >= 80 ? '🎯' : confidence >= 50 ? '⚠️ ' : '❓';
    const color = confidence >= 80 ? chalk.green : confidence >= 50 ? chalk.yellow : chalk.red;
    console.log(`  ${icon} ` + chalk.bold('Confidence: ') + color(`${confidence}%`));
  }

  // ── Resources ──
  if (resources && resources.length > 0) {
    console.log('');
    console.log(chalk.bold.blue('  📚 RELATED RESOURCES:'));
    resources.forEach(r => {
      console.log(chalk.gray(`     → `) + chalk.underline.blue(r.url) + chalk.gray(` (${r.votes} votes)`));
    });
  }

  // ── Language badge ──
  if (language && language !== 'en') {
    console.log('');
    console.log(chalk.gray(`  🌍 Explained in: `) + chalk.bold.magenta(getLanguageName(language)));
  }

  // ── Mode badge ──
  if (isOffline) {
    console.log(chalk.gray(`  ⚡ Mode: `) + chalk.bold.cyan('Offline (built-in dictionary)'));
  }

  console.log('');
  console.log(DIVIDER);
  console.log(chalk.gray('  Powered by ') + chalk.bold('vibe-error-explainer') + chalk.gray(' — errors, explained like a friend 🤝'));
  console.log(DIVIDER);
  console.log('');
}

/**
 * Format code lines with colors
 */
function formatCodeLines(codeContext) {
  if (!codeContext || !codeContext.lines) return '';

  const maxLineNum = String(codeContext.endLine).length;

  return codeContext.lines.map(line => {
    const lineNum = String(line.lineNumber).padStart(maxLineNum, ' ');
    if (line.isErrorLine) {
      return chalk.red(`  │ → ${lineNum} | `) + chalk.bold.white(line.content);
    }
    return chalk.gray(`  │   ${lineNum} | `) + chalk.dim(line.content);
  }).join('\n');
}

/**
 * Word-wrap text to a given width
 */
function wrapText(text, width) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 > width) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Get display name for a language code
 */
function getLanguageName(code) {
  const names = {
    en: 'English', hindi: 'Hindi (हिन्दी)', telugu: 'Telugu (తెలుగు)',
    tamil: 'Tamil (தமிழ்)', urdu: 'Urdu (اردو)', spanish: 'Español',
    french: 'Français', german: 'Deutsch', japanese: '日本語',
    chinese: '中文', korean: '한국어', arabic: 'العربية',
    bengali: 'Bengali (বাংলা)', marathi: 'Marathi (मराठी)',
    gujarati: 'Gujarati (ગુજરાતી)', kannada: 'Kannada (ಕನ್ನಡ)',
    malayalam: 'Malayalam (മലയാളം)', punjabi: 'Punjabi (ਪੰਜਾਬੀ)',
  };
  return names[code] || code;
}

/**
 * Print a compact one-line error (for prod mode)
 */
function printCompact(result) {
  const { parsed, explanation } = result;
  console.log(
    chalk.red(`💥 ${parsed.type}`) +
    chalk.gray(` @ ${parsed.file || 'unknown'}:${parsed.line || '?'}`) +
    chalk.white(` → ${explanation ? explanation.substring(0, 100) : parsed.message}`)
  );
}

/**
 * Format result as a plain text string (for logging to file)
 */
function formatAsPlainText(result) {
  const { parsed, codeContext, explanation, fixedCode, confidence } = result;
  const lines = [];

  lines.push(`[${new Date().toISOString()}]`);
  lines.push(`ERROR: ${parsed.type}: ${parsed.message}`);

  if (parsed.file) {
    lines.push(`WHERE: ${parsed.file}:${parsed.line}:${parsed.column || ''}`);
  }
  if (parsed.functionName) {
    lines.push(`FUNCTION: ${parsed.functionName}`);
  }

  if (codeContext && codeContext.lines) {
    lines.push('CODE:');
    codeContext.lines.forEach(l => {
      const marker = l.isErrorLine ? '>>>' : '   ';
      lines.push(`  ${marker} ${l.lineNumber}: ${l.content}`);
    });
  }

  if (explanation) {
    lines.push(`EXPLANATION: ${explanation}`);
  }
  if (fixedCode) {
    lines.push(`FIX:\n${fixedCode}`);
  }
  if (confidence !== undefined) {
    lines.push(`CONFIDENCE: ${confidence}%`);
  }

  lines.push('---');
  return lines.join('\n');
}

module.exports = {
  printExplanation,
  printCompact,
  formatAsPlainText,
  formatCodeLines,
  wrapText,
};
