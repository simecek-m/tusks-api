const dotenv = require('dotenv');
let path = '';

switch(process.env.MODE){
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
};

const result = dotenv.config({ path });

if(result.error){
  throw new Error(result.error.message);
} else {
  const config = {
    mode: process.env.NODE_ENV,
    port: process.env.PORT,
    mongoDb: process.env.DB_MONGO
  };

  module.exports = config;

}