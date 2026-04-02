# 🔥 vibe-error-explainer

> **Errors, explained like a friend 🤝**

Translates cryptic code errors into **plain English** — shows what went wrong, which file, which line, the actual broken code, and suggests a fix. Powered by **Google Gemini AI** with an **offline fallback** for 50+ common errors.

**Works in Hindi, Telugu, Tamil, Urdu + 15 more languages.** No other error tool does this.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Plain English Explanations** | Explains errors like a friend, not documentation |
| 📄 **Reads Your Actual Code** | Shows ±5 lines around the error with an arrow `→` pointing to the broken line |
| ✅ **Fix Suggestions with Code** | Generates the actual fixed code you can copy-paste |
| 🌍 **19 Languages** | Hindi, Telugu, Tamil, Urdu, Bengali, Marathi, Spanish, French, and more |
| ⚡ **Express Middleware** | Auto-catches all Express errors — zero manual wrapping |
| 👁️ **Watch Mode** | Watch your app, auto-explain every crash, auto-restart |
| 📊 **Error Stats** | Track which errors you hit the most |
| 🔌 **Offline Mode** | 50+ common errors explained without any API key |
| 📚 **Stack Overflow Search** | Auto-finds related Stack Overflow answers |
| 🎯 **Confidence Score** | AI rates how confident it is about the explanation |
| 📝 **Error History Log** | Saves every explained error with timestamps |

---

## 📦 Installation

```bash
npm install vibe-error-explainer
```

### Setup API Key (Optional)

Create a `.env` file in your project root:

```env
GOOGLE_API_KEY=your-google-api-key-here
VIBE_MODE=dev
VIBE_LANG=en
```

> **No API key?** No problem — offline mode works out of the box for 50+ common errors.

---

## 🚀 Quick Start

### 1. Explain Any Error

```javascript
const { explainError } = require('vibe-error-explainer');

try {
  const users = undefined;
  users.map(u => u.name); // 💥 TypeError!
} catch (err) {
  await explainError(err);
}
```

**Output:**
```
──────────────────────────────────────────────────────────────────────
  💥 TypeError: Cannot read properties of undefined (reading 'map')
──────────────────────────────────────────────────────────────────────

  📍 WHERE: src/app.js → Line 42

  📄 CODE:
  ┌──────────────────────────────────────────────────────────────────
  │   40 |   const users = undefined;
  │   41 |
  │ → 42 |   users.map(u => u.name);
  │   43 |
  │   44 |   res.json(names);
  └──────────────────────────────────────────────────────────────────

  🧠 WHAT HAPPENED:
     You're trying to use .map() on something that isn't an array.
     The variable 'users' is undefined — it hasn't been assigned a
     value yet, or the function that should return data returned nothing.

  ✅ SUGGESTED FIX:
  ┌──────────────────────────────────────────────────────────────────
  │ (users || []).map(u => u.name)
  └──────────────────────────────────────────────────────────────────

  🎯 Confidence: 95%

  📚 RELATED RESOURCES:
     → stackoverflow.com/questions/...  (892 votes)
──────────────────────────────────────────────────────────────────────
```

---

### 2. Express Middleware (Auto-Catch)

```javascript
const express = require('express');
const { vibeErrorMiddleware } = require('vibe-error-explainer');

const app = express();

app.get('/users', (req, res) => {
  // your routes...
});

// Add this AFTER all routes — it catches every unhandled error!
app.use(vibeErrorMiddleware({
  mode: 'dev',    // 'dev' = verbose, 'prod' = minimal
  log: true,      // save errors to vibe-errors.log
  lang: 'hindi',  // explain in Hindi!
}));

app.listen(3000);
```

---

### 3. Global Error Interceptor

```javascript
const { interceptErrors } = require('vibe-error-explainer');

// Catches all uncaught exceptions & unhandled promise rejections
interceptErrors({ lang: 'en', log: true });

// Now any crash in your app gets auto-explained!
```

---

## 🖥️ CLI Usage

```bash
# Explain an error
vibe-error "TypeError: Cannot read properties of undefined (reading 'map')"

# Explain in Hindi
vibe-error --lang hindi "TypeError: Cannot read properties..."

# Watch mode — auto-restart & explain crashes
vibe-error --watch "node server.js"

# View error statistics
vibe-error --stats

# Offline mode (no API key needed)
vibe-error --offline "TypeError: ..."

# List supported languages
vibe-error --languages

# Clear error log
vibe-error --clear
```

---

## 🌍 Supported Languages

| Code | Language | Script |
|---|---|---|
| `en` | English | — |
| `hindi` | Hindi | हिन्दी |
| `telugu` | Telugu | తెలుగు |
| `tamil` | Tamil | தமிழ் |
| `urdu` | Urdu | اردو |
| `bengali` | Bengali | বাংলা |
| `marathi` | Marathi | मराठी |
| `gujarati` | Gujarati | ગુજરાતી |
| `kannada` | Kannada | ಕನ್ನಡ |
| `malayalam` | Malayalam | മലയാളം |
| `punjabi` | Punjabi | ਪੰਜਾਬੀ |
| `spanish` | Spanish | Español |
| `french` | French | Français |
| `german` | German | Deutsch |
| `japanese` | Japanese | 日本語 |
| `chinese` | Chinese | 中文 |
| `korean` | Korean | 한국어 |
| `arabic` | Arabic | العربية |
| `portuguese` | Portuguese | Português |

---

## ⚙️ Configuration

### Via `.env` file

```env
GOOGLE_API_KEY=your-google-api-key-here
VIBE_MODE=dev           # dev (verbose) or prod (minimal)
VIBE_LANG=en            # default language
VIBE_LOG=true           # log errors to file
VIBE_OFFLINE=false      # force offline mode
VIBE_CONTEXT_LINES=5    # lines of code context around error
VIBE_MODEL=gemini-flash-latest  # AI model
```

### Via Runtime Options

```javascript
await explainError(error, {
  lang: 'hindi',
  offline: false,
  log: true,
  mode: 'dev',
  contextLines: 5,
});
```

---

## 📊 Error Stats

Track which errors you hit the most:

```bash
vibe-error --stats
```

```
  📊 ERROR FREQUENCY STATS
  ─────────────────────────────────

   1. 12x  ████████████████████
      TypeError: Cannot read properties of undefined
      Last: 2 hours ago

   2. 5x   ████████
      ECONNREFUSED 127.0.0.1:27017
      Last: 1 day ago

   3. 3x   █████
      Cannot find module './missing'
      Last: 3 days ago

  Total: 20 errors tracked | 3 unique error types
```

---

## 📝 API Reference

### `explainError(error, options?)`
Explain an error with full pipeline (parse → read code → AI/offline → display).

### `vibeErrorMiddleware(options?)`
Express error middleware. Add after all routes.

### `interceptErrors(options?)`
Hooks into `process.on('uncaughtException')` and `process.on('unhandledRejection')`.

### `startWatchMode(command, options?)`
Watch mode — spawns process, catches crashes, explains, restarts.

### `parseError(error)`
Parse an Error object into structured data (file, line, type, message).

### `findOfflineExplanation(parsedError)`
Look up an error in the offline dictionary.

---

## 🤝 Contributing

Pull requests are welcome! Especially for:
- Adding more errors to the offline dictionary
- Adding more language support
- VS Code extension (coming soon!)

---

## 📄 License

MIT © vibe-error-explainer

---

**Made with ❤️ for vibe coders who just want to ship code, not decode errors.**
