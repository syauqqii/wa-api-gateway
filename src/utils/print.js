const chalk = require('chalk');
const { logger_timestamp } = require('./date.js');

function Print(message) {
    const timestamp = chalk.gray(`[${logger_timestamp()}]`);
    console.log(` ${timestamp} ${chalk.cyan(message)}`);
}

function PrintError(message) {
    const timestamp = chalk.gray(`[${logger_timestamp()}]`);
    console.error(` ${timestamp} ${chalk.red(message)}`);
}

module.exports = { Print, PrintError };