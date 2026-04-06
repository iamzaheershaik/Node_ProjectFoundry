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
function inject(options = {}) {
  const config = options;
  let isExplaining = false;

  // Catch uncaught exceptions
  process.on('uncaughtException', async (error) => {
    try {
      await explainError(error, config);
    } catch (explainErr) {
      console.error('[vibe-error-explainer] Failed to explain error:', explainErr.message);
      console.error('Original error:', error);
    }

    if (config.exitOnError !== false) {
      process.exit(1);
    }
  });

  // Catch unhandled promise rejections
  process.on('unhandledRejection', async (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    try {
      await explainError(error, config);
    } catch (explainErr) {
      console.error('[vibe-error-explainer] Failed to explain rejection:', explainErr.message);
      console.error('Original rejection:', reason);
    }

    if (config.exitOnRejection) {
      process.exit(1);
    }
  });

  // Monkey-patch console.error
  const originalConsoleError = console.error;
  console.error = async function(...args) {
    if (isExplaining) {
       return originalConsoleError.apply(console, args);
    }
    
    const errArg = args.find(arg => arg instanceof Error);
    if (errArg) {
      isExplaining = true;
      try {
        await explainError(errArg, config);
      } catch (e) {
         originalConsoleError.apply(console, ['[vibe-error-explainer] inner fail: ', e.message]);
      }
      isExplaining = false;
    }
    
    originalConsoleError.apply(console, args);
  };

  return {
    detach: () => {
      process.removeAllListeners('uncaughtException');
      process.removeAllListeners('unhandledRejection');
      console.error = originalConsoleError;
    },
  };
}

module.exports = { inject, interceptErrors: inject };
