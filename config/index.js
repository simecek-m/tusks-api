const dotenv = require('dotenv');
const colors = require('colors');

let path = '';

// pick path for config file dependent on app mode
switch (process.env.MODE) {
  case 'dev': {
    path = 'config/.dev.env';
    break;
  }
  case 'test': {
    path = 'config/.test.env';
    break;
  }
  default:
    path = 'config/.env';
    break;
}

console.log(colors.blue(`App running in '${process.env.MODE}' mode, opening ${path} config file!`));

// print result for opening config file into the console
const result = dotenv.config({ path });
if (result.error) {
  console.log(colors.red(result.error.message));
} else {
  console.log(colors.green(`Config file ${path} loaded successfully`));
}

// set module variables by environmental variables 
const config = {
  mode: process.env.MODE,
  port: process.env.PORT,
  mongoDb: process.env.DB_MONGO
};

module.exports = config;
