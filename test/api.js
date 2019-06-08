const { mongoDb } = require('~root/config');
const { Seeder } = require('mongo-seeding');
const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jsonSchema = require('chai-json-schema');
const app = require('../app.js');
const should = chai.should();

// schemas for validation
const taskSchema = require('./schema/task');
const todoSchema = require('./schema/todo');
const todosSchema = require('./schema/todos');

// create seeder object (initializing database before each test)
const seeder = new Seeder({
  database: mongoDb,
  dropDatabase: true
});

// read collections for seed test database
const collections = seeder.readCollectionsFromPath(path.resolve('./test/data/'));

// use chai middleware
chai.use(chaiHttp);
chai.use(jsonSchema);

describe('/todos', () => {

  // drop current db and import startup data before each test
  beforeEach(async () => {
    await seeder.import(collections)
  });

  it('should GET all todo lists', async () => {
    const response = await chai.request(app).get('/api/todos');
    response.should.have.status(200);
    response.body.should.be.jsonSchema(todosSchema);
    response.body.length.should.be.equal(3);
  });
});

describe.skip('/todos', () => {
  it('should GET specific todo list', async () => {
    throw new Error('not implemented yet');
  });
  it('should POST new todo list', async () => {
    throw new Error('not implemented yet');
  });
  it('should UPDATE specific todo list', async () => {
    throw new Error('not implemented yet');
  });
  it('should DELETE specific todo list', async () => {
    throw new Error('not implemented yet');
  });
});

describe.skip('/todos/:id/task', () => {
  it('should GET specific task from todo list', async () => {
    throw new Error('not implemented yet');
  });
  it('should POST new task into todo list', async () => {
    throw new Error('not implemented yet');
  });
  it('should UPDATE specific task in todo list', async () => {
    throw new Error('not implemented yet');
  });
  it('should DELETE specific task in todo list', async () => {
    throw new Error('not implemented yet');
  });
});