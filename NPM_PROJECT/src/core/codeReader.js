const fs = require('fs');

/**
 * Code Reader
 * Reads the actual source code around the error line
 */

/**
 * Read source code around a specific line in a file
 * @param {string} filePath - Absolute path to the source file
 * @param {number} errorLine - The line number where the error occurred
 * @param {number} contextLines - Number of lines above/below to include (default: 5)
 * @returns {object|null} Code context object or null if file can't be read
 */
function readCodeContext(filePath, errorLine, contextLines = 5) {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      return null;
    }

    const source = fs.readFileSync(filePath, 'utf-8');
    const lines = source.split('\n');
    const totalLines = lines.length;

    if (errorLine < 1 || errorLine > totalLines) {
      return null;
    }

    const startLine = Math.max(1, errorLine - contextLines);
    const endLine = Math.min(totalLines, errorLine + contextLines);

    const codeLines = [];
    for (let i = startLine; i <= endLine; i++) {
      codeLines.push({
        lineNumber: i,
        content: lines[i - 1], // arrays are 0-indexed
        isErrorLine: i === errorLine,
      });
    }

    return {
      filePath,
      errorLine,
      startLine,
      endLine,
      totalLines,
      lines: codeLines,
      errorContent: lines[errorLine - 1] || '',
    };

  } catch (err) {
    return null;
  }
}

/**
 * Format code context as a readable string with line numbers and arrow
 * @param {object} context - Code context from readCodeContext
 * @returns {string} Formatted code string
 */
function formatCodeContext(context) {
  if (!context || !context.lines) return '';

  const maxLineNum = String(context.endLine).length;

  return context.lines.map(line => {
    const lineNum = String(line.lineNumber).padStart(maxLineNum, ' ');
    const marker = line.isErrorLine ? '→' : ' ';
    return `  ${marker} ${lineNum} | ${line.content}`;
  }).join('\n');
}

/**
 * Get the code context as plain text (for AI prompt)
 * @param {object} context - Code context from readCodeContext
 * @returns {string} Plain text code snippet
 */
function getCodeForPrompt(context) {
  if (!context || !context.lines) return '';

  return context.lines.map(line => {
    const marker = line.isErrorLine ? '>>>' : '   ';
    return `${marker} ${line.lineNumber}: ${line.content}`;
  }).join('\n');
}

module.exports = {
  readCodeContext,
  formatCodeContext,
  getCodeForPrompt,
};
