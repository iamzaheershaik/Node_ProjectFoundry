const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { generateText } = require('ai');
const { buildExplanationPrompt } = require('./prompts');

/**
 * AI Explainer
 * Calls Google GenAI using Vercel AI SDK to explain errors
 */
async function getAIExplanation({ parsed, codeSnippet, apiKey, lang = 'en', model = 'gemma-4-26b-a4b-it' }) {
  if (!apiKey) {
    throw new Error('No API key provided. Set GOOGLE_API_KEY in your .env file or pass it in options.');
  }

  const prompt = buildExplanationPrompt({ parsed, codeSnippet, lang });
  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  try {
    const result = await generateText({
      model: google(model),
      prompt: prompt,
      providerOptions: {
        google: {
          thinkingLevel: 'high',
        },
      },
    });

    const text = result.text || '';

    // Parse the JSON response
    try {
      // Clean up any markdown fences Gemini might add despite instructions
      const cleaned = text
        .replace(/^```(?:json)?\s*/m, '')
        .replace(/\s*```\s*$/m, '')
        .trim();

      const jsonResult = JSON.parse(cleaned);

      return {
        explanation: jsonResult.explanation || 'Could not generate explanation.',
        fix: jsonResult.fix || null,
        fixedCode: jsonResult.fixedCode || null,
        confidence: typeof jsonResult.confidence === 'number' ? jsonResult.confidence : 70,
        isOffline: false,
      };
    } catch (parseErr) {
      // If AI returned non-JSON, use the raw text as explanation
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

module.exports = { getAIExplanation };
