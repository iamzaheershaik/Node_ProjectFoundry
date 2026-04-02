const { spawn } = require('child_process');
const chalk = require('chalk');

/**
 * Watch Mode
 * Spawns a child process, watches for crashes, auto-explains errors, auto-restarts
 */

/**
 * Start watch mode for a given command
 * @param {string} command - The full command to run (e.g., "node server.js")
 * @param {object} options - Config options
 */
function startWatchMode(command, options = {}) {
  const { explainError } = require('../pipeline');

  const parts = command.split(' ');
  const cmd = parts[0];
  const args = parts.slice(1);

  let restartCount = 0;
  const maxRestarts = options.maxRestarts || 50;
  const restartDelay = options.restartDelay || 2000;

  console.log('');
  console.log(chalk.bold.cyan('  👁️  VIBE WATCH MODE'));
  console.log(chalk.gray('  ─'.repeat(35)));
  console.log(chalk.gray(`  Watching: `) + chalk.white(command));
  console.log(chalk.gray(`  Press Ctrl+C to stop`));
  console.log('');

  function runProcess() {
    if (restartCount >= maxRestarts) {
      console.log(chalk.red(`\n  ⛔ Max restarts (${maxRestarts}) reached. Stopping watch mode.\n`));
      process.exit(1);
    }

    const child = spawn(cmd, args, {
      stdio: ['inherit', 'inherit', 'pipe'], // capture stderr
      cwd: process.cwd(),
      env: { ...process.env },
      shell: true,
    });

    let stderrBuffer = '';

    child.stderr.on('data', (data) => {
      const text = data.toString();
      stderrBuffer += text;
      process.stderr.write(data); // still show stderr to user
    });

    child.on('exit', async (code) => {
      if (code !== 0 && code !== null) {
        console.log('');
        console.log(chalk.bold.red(`  💥 Process crashed with exit code ${code}`));

        // Try to extract and explain the error from stderr
        if (stderrBuffer.trim()) {
          try {
            // Create a synthetic Error from stderr
            const errorLines = stderrBuffer.trim();
            await explainError(errorLines, { ...options, exitOnError: false });
          } catch (e) {
            // If explanation fails, just show the raw error
          }
        }

        restartCount++;
        console.log(chalk.yellow(`\n  🔄 Restarting in ${restartDelay / 1000}s... (restart #${restartCount})\n`));
        setTimeout(runProcess, restartDelay);
      } else {
        console.log(chalk.green(`\n  ✅ Process exited cleanly.\n`));
      }
    });

    child.on('error', (err) => {
      console.log(chalk.red(`\n  ❌ Failed to start: ${err.message}\n`));
    });

    // Handle Ctrl+C
    process.on('SIGINT', () => {
      child.kill('SIGINT');
      console.log(chalk.gray('\n  Watch mode stopped.\n'));
      process.exit(0);
    });
  }

  runProcess();
}

module.exports = { startWatchMode };
