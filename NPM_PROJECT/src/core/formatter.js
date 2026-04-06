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
    explanation,
    fixedCode,
  } = result;

  console.log('');
  console.log(chalk.bold.red('THIS IS YOUR ERROR YOU NEED FIX THIS'));
  
  if (parsed.file && parsed.line) {
    console.log(
      chalk.yellow('File: ') + chalk.white(parsed.file) + 
      chalk.yellow(' | Line: ') + chalk.white(parsed.line) + 
      (parsed.column ? chalk.yellow(' | Column: ') + chalk.white(parsed.column) : '')
    );
  }

  if (explanation) {
    console.log('\n' + chalk.white(explanation));
  }

  if (fixedCode) {
    console.log('\n' + chalk.bold.green('SOLUTION:'));
    fixedCode.split('\n').forEach(line => {
      console.log(chalk.green(`  ${line}`));
    });
  }

  console.log('');
}

/**
 * Format code lines with colors
 */
function formatCodeLines(codeContext, errorColumn = null) {
  if (!codeContext || !codeContext.lines) return '';

  const maxLineNum = String(codeContext.endLine).length;
  const resultLines = [];

  codeContext.lines.forEach(line => {
    const lineNum = String(line.lineNumber).padStart(maxLineNum, ' ');
    if (line.isErrorLine) {
      resultLines.push(chalk.red(`  │ → ${lineNum} | `) + chalk.bold.white(line.content));
      if (errorColumn > 0) {
        const prefixSpaces = ' '.repeat(9 + maxLineNum + (errorColumn - 1));
        resultLines.push(chalk.red(`${prefixSpaces}^`));
      }
    } else {
      resultLines.push(chalk.gray(`  │   ${lineNum} | `) + chalk.dim(line.content));
    }
  });

  return resultLines.join('\n');
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
