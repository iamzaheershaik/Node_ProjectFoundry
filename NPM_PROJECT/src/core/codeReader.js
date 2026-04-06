const fs = require('fs');
const path = require('path');

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB limit limit to prevent DOS
const SENSITIVE_PATTERNS = ['.env', 'id_rsa', '.pem', 'credentials', 'secrets.json'];

/**
 * Validates if the file path is within project bounds and not sensitive
 * @param {string} filePath - Path to check
 * @returns {boolean} Whether the path is safe to read
 */
function isPathSafe(filePath) {
  try {
    if (typeof filePath !== 'string' || filePath.indexOf('\\0') !== -1) {
      return false;
    }
    const resolvedPath = path.resolve(filePath);
    const cwd = process.cwd();
    
    // Check directory traversal out of CWD
    if (!resolvedPath.startsWith(cwd + path.sep) && resolvedPath !== cwd) {
      // Allow if it's within node_modules somewhere just in case, but prefer not
      // Usually users want their own errors, but the stack might have node_modules inside CWD anyway
      return false;
    }

    // Check sensitive files
    const basename = path.basename(resolvedPath).toLowerCase();
    if (SENSITIVE_PATTERNS.some(p => basename.includes(p))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Code Reader
 * Reads the actual source code around the error line
 */
function readCodeContext(filePath, errorLine, contextLines = 5) {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      return null;
    }

    if (!isPathSafe(filePath)) {
      return null;
    }

    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE || stats.size === 0) {
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
  isPathSafe,
};
