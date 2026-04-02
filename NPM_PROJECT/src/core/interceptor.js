/**
 * Global Error Interceptor
 * Catches uncaught exceptions and unhandled rejections,
 * then pipes them through the vibe-error-explainer pipeline
 */

const { explainError } = require('../pipeline');

/**
 * Setup global error interception
 * @param {object} options - Config options
 */
function interceptErrors(options = {}) {
  const config = options;

  // Catch uncaught exceptions
  process.on('uncaughtException', async (error) => {
    try {
      await explainError(error, config);
    } catch (explainErr) {
      // If the explainer itself fails, still show the original error
      console.error('[vibe-error-explainer] Failed to explain error:', explainErr.message);
      console.error('Original error:', error);
    }

    // Exit with failure code — uncaught exceptions should still crash
    if (config.exitOnError !== false) {
      process.exit(1);
    }
  });

  // Catch unhandled promise rejections
  process.on('unhandledRejection', async (reason) => {
    const error = reason instanceof Error
      ? reason
      : new Error(String(reason));

    try {
      await explainError(error, config);
    } catch (explainErr) {
      console.error('[vibe-error-explainer] Failed to explain rejection:', explainErr.message);
      console.error('Original rejection:', reason);
    }

    // Optionally exit on unhandled rejections
    if (config.exitOnRejection) {
      process.exit(1);
    }
  });

  return {
    detach: () => {
      process.removeAllListeners('uncaughtException');
      process.removeAllListeners('unhandledRejection');
    },
  };
}

module.exports = { interceptErrors };
