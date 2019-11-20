const { MONGO_URL } = require('~config');
const { Seeder } = require('mongo-seeding');
const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jsonSchema = require('chai-json-schema');
const sinon = require('sinon');
const auth = require('~auth');
const { deleteModuleCache } = require('~test-helper/index');

// schemas for validation
const todosSchema = require('~schema/todos');
const todoSchema = require('~schema/todo');
const taskSchema = require('~schema/task');
const errorSchema = require('~schema/error');

// use chai middleware
chai.use(chaiHttp);
chai.use(jsonSchema);
const should = chai.should();

const TEST_EMAIL = 'todo@todo.com';
const TEST_TODO_LIST_TITLE = 'test';

const TEST_TODO_LIST_ID = '5cfe9d771b6ff31cc8e31fb3';
const TEST_TODO_TITLE = 'Work';
const TEST_TASK_ID = '5ce1b62a4a3cf024bc3c6f17';
const TEST_TASK_TEXT = 'install yarn';

describe('API endpoints', () => {

  // run application before tests begin & turn off authentication
  before(async () => {
    // delete cached app instance
    deleteModuleCache('~root/src/app');

    // replace auth middleware with this implementation
    sinon.replace(auth, 'authenticate', (req, res, next) => {
      req.locals = TEST_EMAIL;
      next();
    });
    this.app = require('~root/src/app');

    // create seeder object (initializing database)
    this.seeder = new Seeder({
      database: MONGO_URL,
      dropDatabase: true
    });

    // start application
    this.server = await this.app.start();

    // read collections for seed test database
    this.collections = this.seeder.readCollectionsFromPath(path.resolve('./test/data/db/'));
  });

  // close application after all tests
  after(async () => {
    await this.app.stop();
    sinon.restore();
    deleteModuleCache('~root/src/app');
  });

  // drop current db and import startup data before each test
  beforeEach(async () => {
    await this.seeder.import(this.collections);
  });

  it('GET /api/todos', async () => {
    const response = await chai.request(this.server).get('/api/todos');
    should.exist(response);
    response.should.have.status(200);
    response.body.should.not.be.empty;
    response.body.should.be.jsonSchema(todosSchema);
    response.body.length.should.be.equal(2);
  });

  it('POST /api/todos', async () => {
    const response = await chai.request(this.server).post('/api/todos').send({ title: TEST_TODO_LIST_TITLE });
    should.exist(response);
    response.should.have.status(200);
    response.body.should.not.be.empty;
    response.body.should.have.jsonSchema(todoSchema);
    response.body._id.should.be.an('string').that.is.not.empty;
    response.body.author.should.be.an('string').that.is.equal(TEST_EMAIL);
    response.body.title.should.be.an('string').that.is.equal(TEST_TODO_LIST_TITLE);
    response.body.tasks.should.be.an('array').that.is.empty;
    response.body.__v.should.be.an('number').that.is.equal(0);
  });

  it('GET /api/todos/:id', async () => {
    const response = await chai.request(this.server).get(`/api/todos/${TEST_TODO_LIST_ID}`);
    should.exist(response);
    response.should.have.status(200);
    response.body.should.have.jsonSchema(todoSchema);
    response.body._id.should.be.an('string').that.is.equal(TEST_TODO_LIST_ID);
    response.body.title.should.be.an('string').that.is.equal(TEST_TODO_TITLE);
    response.body.tasks.should.be.an('array').that.have.lengthOf(2);
    response.body.author.should.be.an('string').that.is.equals(TEST_EMAIL);
  });

  it('PUT /api/todos/:id', async () => {
    const update = { 
      title: 'Updated Title',
      tasks: []
    };
    const response = await chai.request(this.server).put(`/api/todos/${TEST_TODO_LIST_ID}`).send(update);
    should.exist(response);
    response.should.have.status(200);
    response.should.not.be.empty;
    response.body.should.be.jsonSchema(todoSchema);
    response.body.title.should.be.an('string').that.is.equal(update.title);
    response.body._id.should.be.an('string').that.is.equal(TEST_TODO_LIST_ID);
    response.body.author.should.be.an('string').that.is.equals(TEST_EMAIL);
    response.body.tasks.should.be.empty;
  });

  it('DELETE /api/todos/:id', async () => {
    const response = await chai.request(this.server).delete(`/api/todos/${TEST_TODO_LIST_ID}`);
    should.exist(response);
    response.should.have.status(200);
    response.body.should.not.be.empty;
    response.body.should.be.jsonSchema(todoSchema);
    response.body._id.should.equal(TEST_TODO_LIST_ID);
    response.body.author.should.be.equals(TEST_EMAIL);
  });

  it('GET /api/todos/:id/tasks/:id', async () => {
    const response = await chai.request(this.server).get(`/api/todos/${TEST_TODO_LIST_ID}/tasks/${TEST_TASK_ID}`);
    response.should.have.status(200);
    response.body.should.not.be.empty;
    response.body.should.have.jsonSchema(taskSchema);
    response.body._id.should.be.an('string').that.is.equal(TEST_TASK_ID);
    response.body.text.should.be.an('string').that.is.equals(TEST_TASK_TEXT);
    response.body.completed.should.be.an('boolean').that.is.false;
  });

});

describe('Wrong API endpoints', () => {
  
  const STATUS_NOT_FOUND = 404;
  const STATUS_BAD_REQUEST = 400;

  it('GET /random', async () => {
    const PATH = '/random';
    const ENDPOINT_NOT_EXIST_MESSAGE = `${PATH} is not valid API endpoint. Missing /api/ prefix!`;
    const response = await chai.request(this.server).get(PATH);
    should.exist(response);
    response.should.have.status(STATUS_NOT_FOUND);
    response.body.should.not.be.empty;
    response.body.status.should.be.equals(STATUS_NOT_FOUND);
    response.body.message.should.be.equals(ENDPOINT_NOT_EXIST_MESSAGE);
  });

  it('GET /api/random', async () => {
    const PATH = '/api/random';
    const ENDPOINT_NOT_EXIST_MESSAGE = `API endpoint ${PATH} doesn't exist`;
    const response = await chai.request(this.server).get(PATH);
    should.exist(response);
    response.should.have.status(STATUS_NOT_FOUND);
    response.body.should.not.be.empty;
    response.body.status.should.be.equals(STATUS_NOT_FOUND);
    response.body.message.should.be.equals(ENDPOINT_NOT_EXIST_MESSAGE);
  });

  it('GET /api/todos/random', async () => {
    const PATH = '/api/todos/random';
    const response = await chai.request(this.server).get(PATH);
    should.exist(response);
    response.should.have.status(STATUS_BAD_REQUEST);
    response.body.should.not.be.empty;
    response.body.should.have.jsonSchema(errorSchema);
  });

});
