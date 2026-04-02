const fs = require('fs');
const chalk = require('chalk');

/**
 * Error Frequency Tracker / Stats
 * Parses vibe-errors.log and shows which errors you hit the most
 */

/**
 * Parse the error log and return frequency stats
 * @param {string} logFile - Path to vibe-errors.log
 * @returns {Array} Sorted array of { error, count, lastSeen }
 */
function getErrorStats(logFile) {
  try {
    if (!fs.existsSync(logFile)) {
      return [];
    }

    const content = fs.readFileSync(logFile, 'utf-8');
    const errorMap = {};

    // Extract ERROR: lines and timestamps
    const blocks = content.split('═══════════════════════════════════════════════════');

    for (const block of blocks) {
      if (!block.trim()) continue;

      const timestampMatch = block.match(/\[(\d{4}-\d{2}-\d{2}T[\d:.]+Z)\]/);
      const errorMatch = block.match(/ERROR:\s*(.+)/);

      if (errorMatch) {
        const errorKey = normalizeError(errorMatch[1].trim());
        const timestamp = timestampMatch ? timestampMatch[1] : null;

        if (!errorMap[errorKey]) {
          errorMap[errorKey] = { error: errorKey, count: 0, lastSeen: null, firstSeen: null };
        }
        errorMap[errorKey].count++;
        if (timestamp) {
          errorMap[errorKey].lastSeen = timestamp;
          if (!errorMap[errorKey].firstSeen) {
            errorMap[errorKey].firstSeen = timestamp;
          }
        }
      }
    }

    // Sort by count (most frequent first)
    return Object.values(errorMap).sort((a, b) => b.count - a.count);

  } catch {
    return [];
  }
}

/**
 * Normalize error messages to group similar errors together
 * e.g., remove specific variable names, file paths, etc.
 */
function normalizeError(errorStr) {
  return errorStr
    // Remove specific file paths
    .replace(/['"]\/[^'"]+['"]/g, "'<path>'")
    // Remove specific variable names in quotes
    .replace(/reading '(\w+)'/g, "reading '<property>'")
    // Keep the core error pattern
    .substring(0, 100);
}

/**
 * Print error stats to terminal
 * @param {Array} stats - Stats from getErrorStats
 */
function printStats(stats) {
  if (stats.length === 0) {
    console.log(chalk.yellow('\n  📊 No errors logged yet. Run your app with vibe-error-explainer to start tracking!\n'));
    return;
  }

  console.log('');
  console.log(chalk.bold.cyan('  📊 ERROR FREQUENCY STATS'));
  console.log(chalk.gray('  ─'.repeat(35)));
  console.log('');

  const maxCount = stats[0].count;

  stats.slice(0, 15).forEach((stat, i) => {
    const rank = chalk.gray(`  ${String(i + 1).padStart(2)}.`);
    const count = chalk.bold.yellow(`${stat.count}x`);
    const bar = chalk.green('█'.repeat(Math.ceil((stat.count / maxCount) * 20)));
    const error = chalk.white(stat.error.substring(0, 60));

    console.log(`${rank} ${count.padEnd(15)} ${bar}`);
    console.log(chalk.gray(`      ${error}`));

    if (stat.lastSeen) {
      const ago = getTimeAgo(stat.lastSeen);
      console.log(chalk.dim.gray(`      Last: ${ago}`));
    }
    console.log('');
  });

  const total = stats.reduce((sum, s) => sum + s.count, 0);
  console.log(chalk.gray('  ─'.repeat(35)));
  console.log(chalk.bold(`  Total: ${total} errors tracked | ${stats.length} unique error types`));
  console.log('');
}

/**
 * Get a human-readable "time ago" string
 */
function getTimeAgo(isoString) {
  try {
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diff = now - then;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } catch {
    return isoString;
  }
}

module.exports = { getErrorStats, printStats };
