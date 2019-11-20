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

// use chai middleware
chai.use(chaiHttp);
chai.use(jsonSchema);
const should = chai.should();

const TEST_EMAIL = 'todo@todo.com';
const TEST_TODO_LIST_TITLE = 'test';

const TEST_TODO_LIST_ID = '5cfe9d771b6ff31cc8e31fb3';
const TEST_TODO_TITLE = 'Work';

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

  it('should GET all todo lists', async () => {
    const response = await chai.request(this.server).get('/api/todos');
    should.exist(response);
    response.should.have.status(200);
    response.body.should.not.be.empty;
    response.body.should.be.jsonSchema(todosSchema);
    response.body.length.should.be.equal(2);
  });

  it('should POST new todo list', async () => {
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

  it('should GET specific todo list', async () => {
    const response = await chai.request(this.server).get(`/api/todos/${TEST_TODO_LIST_ID}`);
    should.exist(response);
    response.should.have.status(200);
    response.body.should.have.jsonSchema(todoSchema);
    response.body._id.should.be.an('string').that.is.equal(TEST_TODO_LIST_ID);
    response.body.title.should.be.an('string').that.is.equal(TEST_TODO_TITLE);
    response.body.tasks.should.be.an('array').that.have.lengthOf(2);
    response.body.author.should.be.an('string').that.is.equals(TEST_EMAIL);
  });

  it('should UPDATE specific todo list', async () => {
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

});
