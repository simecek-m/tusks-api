const { mongoDb } = require('~root/config');
const { Seeder } = require('mongo-seeding');
const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jsonSchema = require('chai-json-schema');
const app = require('../app.js');

// schemas for validation
const errorSchema = require('./schema/error');
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
chai.should();

describe('/todos', () => {

  // drop current db and import startup data before each test
  beforeEach(async () => {
    await seeder.import(collections);
  });

  it('should GET all todo lists', async () => {
    const response = await chai.request(app).get('/api/todos');
    response.should.have.status(200);
    response.body.should.not.be.empty;
    response.body.should.be.jsonSchema(todosSchema);
    response.body.length.should.be.equal(3);
  });

  it('should POST new todo list', async () => {
    const response = await chai.request(app).post('/api/todos');
    response.should.have.status(200);
    response.body.should.not.be.empty;
    response.body.should.have.jsonSchema(todoSchema);
    response.body._id.should.be.an('string').that.is.not.empty;
    response.body.title.should.be.an('string').that.is.equal('Title');
    response.body.tasks.should.be.an('array').that.is.empty;
    response.body.__v.should.be.an('number').that.is.equal(0);
  });

  it('should GET specific todo list', async () => {
    const response = await chai.request(app).get('/api/todos/5cfe9d771b6ff31cc8e31fb4');
    response.should.have.status(200);
    response.body.should.have.jsonSchema(todoSchema);
    response.body.title.should.be.an('string').that.is.equal('Free Time');
    response.body.tasks.should.be.an('array').that.have.lengthOf(1);
  });

  it('should UPDATE specific todo list', async () => {
    const todoListId = '5cfe9d771b6ff31cc8e31fb4';
    const update = { title: 'Updated Title' };
    const response = await chai.request(app).put(`/api/todos/${todoListId}`).send(update);
    response.should.have.status(200);
    response.should.not.be.empty;
    response.body.should.be.jsonSchema(todoSchema);
    response.body._id.should.be.an('string').that.is.equal(todoListId);
    response.body.title.should.be.an('string').that.is.equal(update.title);
  });

  it('should DELETE specific todo list', async () => {
    const todoListId = '5cfe9d771b6ff31cc8e31fb4';
    const response = await chai.request(app).delete(`/api/todos/${todoListId}`);
    response.should.have.status(200);
    response.body.should.not.be.empty;
    response.body.should.be.jsonSchema(todoSchema);
    response.body._id.should.equal(todoListId);
  });
});

describe('/todos - ERROR', () => {
  it('should call error middleware after GET /api/todos/random', async () => {
    const response = await chai.request(app).get('/api/todos/randomId');
    response.should.have.status(400);
    response.body.should.not.be.empty;
    response.body.should.have.jsonSchema(errorSchema);
  });
});

describe('/todos/:id/task', () => {
  it('should POST new task into todo list', async () => {
    const todoListId = '5cfe9d771b6ff31cc8e31fb4';
    const insertedTask = { text: 'install yarn' };
    const response = await chai.request(app).post(`/api/todos/${todoListId}/tasks`).send(insertedTask);
    response.should.have.status(200);
    response.body.should.not.be.empty;
    response.body.should.have.jsonSchema(taskSchema);
    response.body._id.should.be.an('string').that.is.not.empty;
    response.body.completed.should.be.an('boolean').that.is.equal(false);
    response.body.text.should.be.an('string').that.is.equal(insertedTask.text);
  });
});

describe.skip('/todos/:id/task', () => {
  it('should GET specific task from todo list', async () => {
    throw new Error('not implemented yet');
  });
  it('should UPDATE specific task in todo list', async () => {
    throw new Error('not implemented yet');
  });
  it('should DELETE specific task in todo list', async () => {
    throw new Error('not implemented yet');
  });
});
