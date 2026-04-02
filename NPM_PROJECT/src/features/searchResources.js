const https = require('https');

/**
 * Stack Overflow / GitHub Issues Search
 * Finds related resources for an error message
 */

/**
 * Search Stack Overflow for related questions
 * @param {string} errorMessage - The error message to search for
 * @param {number} limit - Max results (default: 3)
 * @returns {Array} Array of { title, url, votes, answered }
 */
async function searchStackOverflow(errorMessage, limit = 3) {
  try {
    // Clean up the error message for search
    const query = encodeURIComponent(
      errorMessage
        .replace(/['"]/g, '')
        .substring(0, 120)
    );

    const url = `https://api.stackexchange.com/2.3/search/excerpts?order=desc&sort=relevance&q=${query}&site=stackoverflow&pagesize=${limit}&filter=default`;

    const data = await httpGet(url);

    if (!data || !data.items) return [];

    return data.items.slice(0, limit).map(item => ({
      title: decodeHtml(item.title || ''),
      url: `https://stackoverflow.com/questions/${item.question_id}`,
      votes: item.score || 0,
      answered: item.is_answered || false,
    }));

  } catch {
    return [];
  }
}

/**
 * Simple HTTPS GET request that returns parsed JSON
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'vibe-error-explainer',
      },
      timeout: 5000,
    };

    https.get(url, options, (res) => {
      const chunks = [];

      // Handle gzip
      let stream = res;
      if (res.headers['content-encoding'] === 'gzip') {
        const zlib = require('zlib');
        stream = res.pipe(zlib.createGunzip());
      }

      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => {
        try {
          const body = Buffer.concat(chunks).toString();
          resolve(JSON.parse(body));
        } catch {
          resolve(null);
        }
      });
      stream.on('error', () => resolve(null));
    }).on('error', () => resolve(null))
      .on('timeout', function () {
        this.destroy();
        resolve(null);
      });
  });
}

/**
 * Decode HTML entities
 */
function decodeHtml(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

module.exports = { searchStackOverflow };
