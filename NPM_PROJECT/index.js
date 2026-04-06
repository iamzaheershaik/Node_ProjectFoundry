/**
 * vibe-error-explainer
 * Translates cryptic code errors into plain English — shows what went wrong,
 * which file, which line, and suggests fixes.
 *
 * Usage:
 *
 *   // Explain a single error
 *   const { explainError } = require('vibe-error-explainer');
 *   await explainError(error, { lang: 'hindi' });
 *
 *   // Express middleware
 *   const { vibeErrorMiddleware } = require('vibe-error-explainer');
 *   app.use(vibeErrorMiddleware({ mode: 'dev', log: true }));
 *
 *   // Global error interceptor
 *   const { interceptErrors } = require('vibe-error-explainer');
 *   interceptErrors({ lang: 'en', log: true });
 */

const { explainError } = require('./src/pipeline');
const { vibeErrorMiddleware } = require('./src/middleware/express');
const { interceptErrors, inject } = require('./src/core/interceptor');
const { startWatchMode } = require('./src/features/watchMode');
const { parseError, getFirstUserFrame } = require('./src/core/parser');
const { readCodeContext, formatCodeContext } = require('./src/core/codeReader');
const { findOfflineExplanation } = require('./src/offline/dictionary');
const { getErrorStats, printStats } = require('./src/features/errorStats');
const { logError } = require('./src/features/errorHistory');
const { getSupportedLanguages, getLanguageList } = require('./src/features/languages');
const { loadConfig } = require('./src/config/config');

module.exports = {
  // Main API
  explainError,
  vibeErrorMiddleware,
  interceptErrors,
  inject,

  // Features
  startWatchMode,
  getErrorStats,
  printStats,

  // Utilities
  parseError,
  getFirstUserFrame,
  readCodeContext,
  formatCodeContext,
  findOfflineExplanation,
  logError,
  loadConfig,
  getSupportedLanguages,
  getLanguageList,
};
