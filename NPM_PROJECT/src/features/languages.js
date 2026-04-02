/**
 * Multi-Language Support
 * Language codes, names, and AI prompt instructions for localized explanations
 */

const LANGUAGES = {
  en: {
    name: 'English',
    nativeName: 'English',
    promptInstruction: 'Explain in clear, simple English.',
  },
  hindi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    promptInstruction: 'Explain in simple Hindi (Hinglish is okay — mix of Hindi and English technical terms). Use Devanagari script. Keep technical terms like "array", "function", "undefined" in English.',
  },
  telugu: {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    promptInstruction: 'Explain in simple Telugu using Telugu script. Keep technical terms like "array", "function", "undefined" in English.',
  },
  tamil: {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    promptInstruction: 'Explain in simple Tamil using Tamil script. Keep technical terms like "array", "function", "undefined" in English.',
  },
  urdu: {
    name: 'Urdu',
    nativeName: 'اردو',
    promptInstruction: 'Explain in simple Urdu. Keep technical terms like "array", "function", "undefined" in English.',
  },
  bengali: {
    name: 'Bengali',
    nativeName: 'বাংলা',
    promptInstruction: 'Explain in simple Bengali using Bengali script. Keep technical terms in English.',
  },
  marathi: {
    name: 'Marathi',
    nativeName: 'मराठी',
    promptInstruction: 'Explain in simple Marathi using Devanagari script. Keep technical terms in English.',
  },
  gujarati: {
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    promptInstruction: 'Explain in simple Gujarati. Keep technical terms in English.',
  },
  kannada: {
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    promptInstruction: 'Explain in simple Kannada. Keep technical terms in English.',
  },
  malayalam: {
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    promptInstruction: 'Explain in simple Malayalam. Keep technical terms in English.',
  },
  punjabi: {
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    promptInstruction: 'Explain in simple Punjabi using Gurmukhi script. Keep technical terms in English.',
  },
  spanish: {
    name: 'Spanish',
    nativeName: 'Español',
    promptInstruction: 'Explain in simple Spanish (Español). Keep technical terms in English.',
  },
  french: {
    name: 'French',
    nativeName: 'Français',
    promptInstruction: 'Explain in simple French. Keep technical terms in English.',
  },
  german: {
    name: 'German',
    nativeName: 'Deutsch',
    promptInstruction: 'Explain in simple German. Keep technical terms in English.',
  },
  japanese: {
    name: 'Japanese',
    nativeName: '日本語',
    promptInstruction: 'Explain in simple Japanese. Keep technical terms in English.',
  },
  chinese: {
    name: 'Chinese',
    nativeName: '中文',
    promptInstruction: 'Explain in simple Simplified Chinese. Keep technical terms in English.',
  },
  korean: {
    name: 'Korean',
    nativeName: '한국어',
    promptInstruction: 'Explain in simple Korean. Keep technical terms in English.',
  },
  arabic: {
    name: 'Arabic',
    nativeName: 'العربية',
    promptInstruction: 'Explain in simple Arabic. Keep technical terms in English.',
  },
  portuguese: {
    name: 'Portuguese',
    nativeName: 'Português',
    promptInstruction: 'Explain in simple Portuguese. Keep technical terms in English.',
  },
};

/**
 * Get language config by code
 * @param {string} code - Language code
 * @returns {object} Language config
 */
function getLanguage(code) {
  return LANGUAGES[code] || LANGUAGES.en;
}

/**
 * Get all supported language codes
 */
function getSupportedLanguages() {
  return Object.keys(LANGUAGES);
}

/**
 * Get a display string of all supported languages
 */
function getLanguageList() {
  return Object.entries(LANGUAGES)
    .map(([code, lang]) => `  ${code.padEnd(12)} ${lang.nativeName} (${lang.name})`)
    .join('\n');
}

module.exports = {
  LANGUAGES,
  getLanguage,
  getSupportedLanguages,
  getLanguageList,
};
