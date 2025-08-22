const readline = require('readline');

async function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    // 监听error事件以处理可能的输入流异常
    rl.on('error', (err) => {
      console.error('Readline interface encountered an error:', err);
      rl.close();
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

module.exports = {
  askQuestion,
};
