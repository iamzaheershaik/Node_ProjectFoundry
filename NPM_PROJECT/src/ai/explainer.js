const https = require('https');
const { buildExplanationPrompt } = require('./prompts');

/**
 * AI Explainer
 * Calls Google Gemini API to explain errors in plain English (or any supported language)
 */

/**
 * Get an AI-powered explanation for an error
 * @param {object} params
 * @param {object} params.parsed - Parsed error object from parser.js
 * @param {string} params.codeSnippet - Code around the error (from codeReader)
 * @param {string} params.apiKey - Google Gemini API key
 * @param {string} params.lang - Language code (default: 'en')
 * @param {string} params.model - Model name (default: 'gemini-flash-latest')
 * @returns {object} { explanation, fix, fixedCode, confidence }
 */
async function getAIExplanation({ parsed, codeSnippet, apiKey, lang = 'en', model = 'gemini-flash-latest' }) {
  if (!apiKey) {
    throw new Error('No API key provided. Set GOOGLE_API_KEY in your .env file or pass it in options.');
  }

  const prompt = buildExplanationPrompt({ parsed, codeSnippet, lang });

  try {
    const requestBody = JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const responseData = await makeRequest(url, requestBody);

    // Extract text from Gemini response
    const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the JSON response
    try {
      // Clean up any markdown fences Gemini might add despite instructions
      const cleaned = text
        .replace(/^```(?:json)?\s*/m, '')
        .replace(/\s*```\s*$/m, '')
        .trim();

      const result = JSON.parse(cleaned);

      return {
        explanation: result.explanation || 'Could not generate explanation.',
        fix: result.fix || null,
        fixedCode: result.fixedCode || null,
        confidence: typeof result.confidence === 'number' ? result.confidence : 70,
        isOffline: false,
      };
    } catch (parseErr) {
      // If Gemini returned non-JSON, use the raw text as explanation
      return {
        explanation: text.substring(0, 500),
        fix: null,
        fixedCode: null,
        confidence: 50,
        isOffline: false,
      };
    }

  } catch (apiErr) {
    if (apiErr.message && apiErr.message.includes('401')) {
      throw new Error('Invalid API key. Check your GOOGLE_API_KEY.');
    }
    if (apiErr.message && apiErr.message.includes('429')) {
      throw new Error('Rate limited. Too many requests — try again in a moment.');
    }
    throw new Error(`AI API error: ${apiErr.message}`);
  }
}

/**
 * Make an HTTPS POST request to Gemini API
 */
function makeRequest(url, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 30000,
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        try {
          const responseBody = Buffer.concat(chunks).toString();
          const parsed = JSON.parse(responseBody);

          if (res.statusCode >= 400) {
            const errMsg = parsed?.error?.message || `HTTP ${res.statusCode}`;
            reject(new Error(`${res.statusCode}: ${errMsg}`));
            return;
          }

          resolve(parsed);
        } catch (e) {
          reject(new Error('Failed to parse API response'));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(body);
    req.end();
  });
}

module.exports = { getAIExplanation };
