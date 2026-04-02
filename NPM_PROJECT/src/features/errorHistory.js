const fs = require('fs');
const path = require('path');

/**
 * Error History Logger
 * Saves every explained error to a log file with timestamps
 */

/**
 * Append an error explanation to the log file
 * @param {string} logFile - Path to the log file
 * @param {object} result - The full explanation result
 */
function logError(logFile, result) {
  try {
    const { parsed, codeContext, explanation, fixedCode, confidence } = result;

    const entry = [];
    entry.push(`═══════════════════════════════════════════════════`);
    entry.push(`[${new Date().toISOString()}]`);
    entry.push(`ERROR: ${parsed.type}: ${parsed.message}`);

    if (parsed.file) {
      entry.push(`FILE:  ${parsed.file}:${parsed.line || '?'}`);
    }
    if (parsed.functionName && parsed.functionName !== '<anonymous>') {
      entry.push(`FUNC:  ${parsed.functionName}`);
    }

    if (codeContext && codeContext.lines) {
      entry.push('');
      entry.push('CODE:');
      codeContext.lines.forEach(l => {
        const marker = l.isErrorLine ? '>>>' : '   ';
        entry.push(`  ${marker} ${l.lineNumber}: ${l.content}`);
      });
    }

    if (explanation) {
      entry.push('');
      entry.push(`EXPLANATION: ${explanation}`);
    }
    if (fixedCode) {
      entry.push('');
      entry.push('FIX:');
      entry.push(fixedCode);
    }
    if (confidence !== undefined) {
      entry.push(`CONFIDENCE: ${confidence}%`);
    }

    entry.push('');
    entry.push('');

    // Ensure directory exists
    const dir = path.dirname(logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.appendFileSync(logFile, entry.join('\n'), 'utf-8');
  } catch (err) {
    // Silently fail — logging should never crash the app
  }
}

/**
 * Read all logged errors
 * @param {string} logFile - Path to the log file
 * @returns {string} Log contents
 */
function readErrorLog(logFile) {
  try {
    if (fs.existsSync(logFile)) {
      return fs.readFileSync(logFile, 'utf-8');
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Clear the error log
 * @param {string} logFile - Path to the log file
 */
function clearErrorLog(logFile) {
  try {
    if (fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, '', 'utf-8');
    }
  } catch {
    // Silently fail
  }
}

module.exports = { logError, readErrorLog, clearErrorLog };
