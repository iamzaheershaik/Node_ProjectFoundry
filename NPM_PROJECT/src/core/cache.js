const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE_FILE = path.resolve(process.cwd(), '.vibe-cache.json');

function generateHash(parsed) {
  const str = `${parsed.file}:${parsed.line}:${parsed.column}:${parsed.message}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

function getCache(parsed) {
  const hash = generateHash(parsed);
  if (!fs.existsSync(CACHE_FILE)) {
    return null;
  }
  try {
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    // Ensure we don't return expired or malformed cache. We'll simplify to just returning it.
    return data[hash] || null;
  } catch (e) {
    return null;
  }
}

function setCache(parsed, explanationData) {
  const hash = generateHash(parsed);
  let data = {};
  if (fs.existsSync(CACHE_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    } catch (e) {}
  }
  data[hash] = explanationData;
  
  // Limit cache to 100 entries max to prevent bloat
  const keys = Object.keys(data);
  if (keys.length > 100) {
    delete data[keys[0]]; // remove oldest (roughly)
  }

  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {}
}

module.exports = { getCache, setCache };
