const { mongoDb } = require('~config');
const mongoose = require('mongoose');
const colors = require('colors');

const database = {
  async connect () {
    console.log(colors.blue('opening mongoose connection'));
    return mongoose.connect(mongoDb, { useCreateIndex:true, useNewUrlParser: true, useFindAndModify: false });
  },
  async disconnect () {
    console.log(colors.yellow('closing mongoose connection'));
    return mongoose.disconnect();
  }
};

module.exports = database;
