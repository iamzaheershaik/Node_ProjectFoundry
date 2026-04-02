/**
 * Stack Trace Parser
 * Extracts structured info from JavaScript/Node.js error stack traces
 */

/**
 * Parse an Error object or stack trace string into structured data
 * @param {Error|string} error - Error object or stack trace string
 * @returns {object} Parsed error info
 */
function parseError(error) {
  const isErrorObj = error instanceof Error;
  const errorMessage = isErrorObj ? error.message : extractMessage(error);
  const errorType = isErrorObj ? error.constructor.name : extractType(error);
  const stack = isErrorObj ? error.stack : error;

  const frames = parseStackFrames(stack);
  const topFrame = frames[0] || {};

  return {
    type: errorType,
    message: errorMessage,
    file: topFrame.file || null,
    line: topFrame.line || null,
    column: topFrame.column || null,
    functionName: topFrame.functionName || null,
    fullStack: stack,
    frames,
  };
}

/**
 * Extract error type from a raw error string
 * e.g., "TypeError: Cannot read properties..." → "TypeError"
 */
function extractType(errorStr) {
  const str = String(errorStr);
  const match = str.match(/^(\w+Error):/m);
  if (match) return match[1];

  // Handle other error-like patterns
  const otherMatch = str.match(/^(Error|ECONNREFUSED|ENOENT|EACCES|EADDRINUSE|MODULE_NOT_FOUND)[\s:]/mi);
  if (otherMatch) return otherMatch[1];

  return 'Error';
}

/**
 * Extract error message from a raw error string
 */
function extractMessage(errorStr) {
  const str = String(errorStr);
  const match = str.match(/^(?:\w+Error:\s*)(.*?)$/m);
  if (match) return match[1].trim();

  // First non-empty line
  const lines = str.split('\n').filter(l => l.trim());
  return lines[0] ? lines[0].trim() : str.trim();
}

/**
 * Parse individual stack frames from a stack trace string
 * Handles Node.js and V8 stack formats
 */
function parseStackFrames(stack) {
  if (!stack) return [];

  const lines = String(stack).split('\n');
  const frames = [];

  for (const line of lines) {
    const frame = parseStackLine(line);
    if (frame) {
      frames.push(frame);
    }
  }

  return frames;
}

/**
 * Parse a single stack trace line
 * Formats:
 *   at functionName (filePath:line:column)
 *   at filePath:line:column
 *   at Object.<anonymous> (filePath:line:column)
 *   at Module._compile (internal/modules/cjs/loader.js:999:30)
 */
function parseStackLine(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('at ')) return null;

  // Pattern 1: at functionName (filePath:line:column)
  let match = trimmed.match(
    /^at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)$/
  );
  if (match) {
    return {
      functionName: cleanFunctionName(match[1]),
      file: match[2],
      line: parseInt(match[3], 10),
      column: parseInt(match[4], 10),
      isInternal: isInternalFrame(match[2]),
      raw: trimmed,
    };
  }

  // Pattern 2: at filePath:line:column
  match = trimmed.match(
    /^at\s+(.+?):(\d+):(\d+)$/
  );
  if (match) {
    return {
      functionName: '<anonymous>',
      file: match[1],
      line: parseInt(match[2], 10),
      column: parseInt(match[3], 10),
      isInternal: isInternalFrame(match[1]),
      raw: trimmed,
    };
  }

  return null;
}

/**
 * Clean up function names for display
 */
function cleanFunctionName(name) {
  if (!name) return '<anonymous>';
  // Remove "Object." prefix — it's noise
  return name.replace(/^Object\./, '').replace(/^Module\./, '') || '<anonymous>';
}

/**
 * Check if a file path is an internal Node.js module
 */
function isInternalFrame(filePath) {
  if (!filePath) return true;
  return (
    filePath.startsWith('node:') ||
    filePath.startsWith('internal/') ||
    filePath.includes('node_modules')
  );
}

/**
 * Get the first user-code frame (skips internal/node_modules frames)
 */
function getFirstUserFrame(frames) {
  return frames.find(f => !f.isInternal) || frames[0] || null;
}

module.exports = {
  parseError,
  parseStackFrames,
  parseStackLine,
  extractType,
  extractMessage,
  getFirstUserFrame,
};
