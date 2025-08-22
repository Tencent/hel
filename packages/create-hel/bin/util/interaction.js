const chalk = require('chalk');
const { askQuestion } = require('./ask');

async function getProjectNameByAsk() {
  const projectName = await askQuestion(chalk.cyan('Enter your project name: '));
  if (!projectName) {
    throw new Error('Project name is empty!');
  }
  return projectName;
}

module.exports = {
  getProjectNameByAsk,
};
