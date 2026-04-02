const { getLanguage } = require('../features/languages');

/**
 * AI Prompt Templates
 * Structured prompts for Claude to explain errors with code context
 */

/**
 * Build the main error explanation prompt
 * @param {object} params
 * @param {object} params.parsed - Parsed error info
 * @param {string} params.codeSnippet - Code around the error line
 * @param {string} params.lang - Language code
 * @returns {string} The prompt for Claude
 */
function buildExplanationPrompt({ parsed, codeSnippet, lang = 'en' }) {
  const language = getLanguage(lang);

  let prompt = `You are a friendly, expert coding mentor. A developer just hit an error and needs help understanding it.

## Error Details
- **Error Type**: ${parsed.type}
- **Error Message**: ${parsed.message}
- **File**: ${parsed.file || 'unknown'}
- **Line**: ${parsed.line || 'unknown'}
- **Function**: ${parsed.functionName || 'unknown'}`;

  if (codeSnippet) {
    prompt += `

## Actual Code at Error Location
Lines marked with >>> are where the error occurred:

\`\`\`javascript
${codeSnippet}
\`\`\``;
  }

  if (parsed.fullStack) {
    prompt += `

## Stack Trace (first 10 lines)
\`\`\`
${parsed.fullStack.split('\n').slice(0, 10).join('\n')}
\`\`\``;
  }

  prompt += `

## Your Task
${language.promptInstruction}

Respond in EXACTLY this JSON format (no markdown, no code fences):
{
  "explanation": "A clear, simple explanation of what went wrong and why. Talk like a friend helping a junior developer. 2-4 sentences max.",
  "fix": "The specific fix for this error. Be concrete and actionable.",
  "fixedCode": "The actual corrected code that fixes the error. Show just the relevant lines. If you can't determine the fix from context, leave this as null.",
  "confidence": <number 0-100 representing how confident you are about this explanation>
}

Rules:
- Keep the explanation SIMPLE. Imagine explaining to someone who just started coding.
- In the fixedCode, show the corrected version of the broken code.
- The confidence should be 90+ if the error is clear and common, 60-89 if you need more context, below 60 if the error is unusual.
- Do NOT wrap your response in markdown code fences. Return raw JSON only.`;

  return prompt;
}

module.exports = { buildExplanationPrompt };
