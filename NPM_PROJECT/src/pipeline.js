const { loadConfig } = require('./config/config');
const { parseError, getFirstUserFrame } = require('./core/parser');
const { readCodeContext, getCodeForPrompt } = require('./core/codeReader');
const { printExplanation, printCompact, formatAsPlainText } = require('./core/formatter');
const { getAIExplanation } = require('./ai/explainer');
const { findOfflineExplanation, getGenericExplanation } = require('./offline/dictionary');
const { logError } = require('./features/errorHistory');
const { searchStackOverflow } = require('./features/searchResources');

/**
 * Central Pipeline
 * Orchestrates: parse → read code → explain (AI or offline) → format → display
 */

/**
 * The main explainError function
 * @param {Error|string} error - Error object or error string
 * @param {object} options - Runtime options (overrides .env)
 * @returns {object} The full explanation result
 */
async function explainError(error, options = {}) {
  const config = loadConfig(options);

  // ── Step 1: Parse the error ──
  let parsed;
  if (error instanceof Error) {
    parsed = parseError(error);
  } else if (typeof error === 'string') {
    // Try to create a synthetic Error for better parsing
    const syntheticErr = new Error(error);
    // Check if the string itself contains a stack trace
    if (error.includes('    at ')) {
      parsed = parseError(error);
    } else {
      parsed = parseError(syntheticErr);
      // Override with the original message since synthetic stack won't be useful
      parsed.message = error.replace(/^\w+Error:\s*/, '');
      parsed.type = error.match(/^(\w+Error):/)?.[1] || 'Error';
    }
  } else {
    parsed = parseError(new Error(String(error)));
  }

  // If the top frame is internal, find the first user-code frame
  if (parsed.frames && parsed.frames.length > 0) {
    const userFrame = getFirstUserFrame(parsed.frames);
    if (userFrame && userFrame !== parsed.frames[0]) {
      parsed.file = userFrame.file;
      parsed.line = userFrame.line;
      parsed.column = userFrame.column;
      parsed.functionName = userFrame.functionName;
    }
  }

  // ── Step 2: Read actual code at error location ──
  let codeContext = null;
  let codeSnippet = null;

  if (parsed.file && parsed.line) {
    codeContext = readCodeContext(parsed.file, parsed.line, config.contextLines);
    if (codeContext) {
      codeSnippet = getCodeForPrompt(codeContext);
    }
  }

  // ── Step 3: Get explanation (AI or offline) ──
  let explanation = null;
  let fixedCode = null;
  let fix = null;
  let confidence = null;
  let isOffline = false;

  if (!config.offline && config.apiKey) {
    // Try AI explanation first
    try {
      const aiResult = await getAIExplanation({
        parsed,
        codeSnippet,
        apiKey: config.apiKey,
        lang: config.lang,
        model: config.model,
      });

      explanation = aiResult.explanation;
      fixedCode = aiResult.fixedCode;
      fix = aiResult.fix;
      confidence = aiResult.confidence;
      isOffline = false;
    } catch (aiErr) {
      // Fall back to offline if AI fails
      const offlineResult = findOfflineExplanation(parsed) || getGenericExplanation(parsed);
      explanation = offlineResult.explanation;
      fixedCode = offlineResult.fixedCode || null;
      fix = offlineResult.fix || null;
      confidence = offlineResult.confidence;
      isOffline = true;
    }
  } else {
    // Offline mode
    const offlineResult = findOfflineExplanation(parsed) || getGenericExplanation(parsed);
    explanation = offlineResult.explanation;
    fixedCode = offlineResult.fixedCode || null;
    fix = offlineResult.fix || null;
    confidence = offlineResult.confidence;
    isOffline = true;
  }

  // ── Step 4: Search Stack Overflow (non-blocking) ──
  let resources = [];
  if (!config.offline && config.mode === 'dev') {
    try {
      resources = await searchStackOverflow(`${parsed.type} ${parsed.message}`, 3);
    } catch {
      // Silently fail
    }
  }

  // ── Step 5: Build the result object ──
  const result = {
    parsed,
    codeContext,
    explanation,
    fixedCode,
    fix,
    confidence,
    isOffline,
    language: config.lang,
    resources,
  };

  // ── Step 6: Display ──
  if (config.mode === 'dev') {
    printExplanation(result);
  } else {
    printCompact(result);
  }

  // ── Step 7: Log to file ──
  if (config.log) {
    logError(config.logFile, result);
  }

  return result;
}

module.exports = { explainError };
