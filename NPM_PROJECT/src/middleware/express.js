/**
 * Express Error Middleware
 * Plug into any Express app — catches errors automatically
 *
 * Usage:
 *   const { vibeErrorMiddleware } = require('vibe-error-explainer');
 *   app.use(vibeErrorMiddleware({ mode: 'dev', log: true }));
 */

const { explainError } = require('../pipeline');

/**
 * Create Express error-handling middleware
 * @param {object} options - Configuration options
 * @param {string} options.mode - 'dev' (verbose) or 'prod' (minimal)
 * @param {boolean} options.log - Whether to log errors to file
 * @param {string} options.lang - Language for explanations
 * @param {boolean} options.offline - Force offline mode
 * @returns {Function} Express error middleware (err, req, res, next)
 */
function vibeErrorMiddleware(options = {}) {
  const config = {
    mode: options.mode || 'dev',
    log: options.log !== undefined ? options.log : true,
    lang: options.lang || 'en',
    offline: options.offline || false,
    exitOnError: false, // Never exit in middleware
    ...options,
  };

  return async function vibeErrorHandler(err, req, res, next) {
    // Only handle errors
    if (!err) {
      return next();
    }

    try {
      // Explain the error
      const result = await explainError(err, config);

      // Send response based on mode
      if (config.mode === 'dev') {
        // In dev mode, send detailed JSON response
        const statusCode = err.status || err.statusCode || 500;

        res.status(statusCode).json({
          success: false,
          error: {
            type: result.parsed.type,
            message: result.parsed.message,
            file: result.parsed.file,
            line: result.parsed.line,
            explanation: result.explanation,
            fix: result.fix,
            fixedCode: result.fixedCode,
            confidence: result.confidence,
          },
          vibeExplained: true,
        });
      } else {
        // In prod mode, send minimal error response
        const statusCode = err.status || err.statusCode || 500;

        res.status(statusCode).json({
          success: false,
          error: {
            message: err.expose ? err.message : 'Internal Server Error',
          },
        });
      }

    } catch (explainErr) {
      // If explanation itself fails, pass to default Express error handler
      console.error('[vibe-error-explainer] Middleware error:', explainErr.message);
      next(err);
    }
  };
}

module.exports = { vibeErrorMiddleware };
