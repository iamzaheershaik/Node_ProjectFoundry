const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');

function applyFixInline(filePath, codeContext, fixedCode) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    
    const errIdx = codeContext.errorLine - 1;
    
    // Replace the exact line with the fixed string
    // the AI provides `fixedCode`
    lines[errIdx] = fixedCode;
    
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(chalk.bold.blue(`\n[Auto-Fixer] 🪄 Successfully applied fix to: ${filePath}\n`));
  } catch (err) {
    console.log(chalk.red(`\n[Auto-Fixer] Failed to auto-fix: ${err.message}\n`));
  }
}

async function promptAutoFix(result, config) {
  if (!config.autoFix) return;

  const { parsed, codeContext, fixedCode } = result;
  
  if (!parsed.file || !codeContext || !fixedCode) return;
  
  if (!parsed.file.startsWith(process.cwd())) {
      console.log(chalk.yellow(`\n[Auto-Fixer] Refused to modify external file: ${parsed.file}\n`));
      return; 
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(chalk.bold.yellow('Apply this fix automatically? (y/N): '), (answer) => {
      rl.close();
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        applyFixInline(parsed.file, codeContext, fixedCode);
      }
      resolve();
    });
  });
}

module.exports = { promptAutoFix };
