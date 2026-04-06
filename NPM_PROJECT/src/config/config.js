const path = require('path');
const fs = require('fs');

/**
 * Configuration loader for vibe-error-explainer
 * Reads from .env, environment variables, and runtime options
 */
function loadConfig(runtimeOptions = {}) {
  // Try to load .env from the project root (where the user's app runs)
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  }

  const config = {
    // Google Gemini API Key
    apiKey: runtimeOptions.apiKey
      || process.env.GOOGLE_API_KEY
      || null,

    // Mode: 'dev' (verbose) or 'prod' (minimal)
    mode: runtimeOptions.mode
      || process.env.VIBE_MODE
      || 'dev',

    // Language for explanations
    lang: runtimeOptions.lang
      || process.env.VIBE_LANG
      || 'en',

    // Whether to log to file
    log: runtimeOptions.log !== undefined
      ? runtimeOptions.log
      : (process.env.VIBE_LOG === 'true' || false),

    // Log file path
    logFile: runtimeOptions.logFile
      || process.env.VIBE_LOG_FILE
      || path.resolve(process.cwd(), 'vibe-errors.log'),

    // Number of context lines around error (above and below)
    contextLines: runtimeOptions.contextLines
      || parseInt(process.env.VIBE_CONTEXT_LINES, 10)
      || 5,

    // Force offline mode (no API calls)
    offline: runtimeOptions.offline
      || process.env.VIBE_OFFLINE === 'true'
      || false,

    // Model to use
    model: runtimeOptions.model
      || process.env.VIBE_MODEL
      || 'gemma-4-26b-a4b-it',
  };

  return config;
}

module.exports = { loadConfig };
