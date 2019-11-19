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

// use chai middleware
chai.use(chaiHttp);
chai.use(jsonSchema);
chai.should();

const TEST_EMAIL = 'todo@todo.com';

describe('/todos', () => {

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
    response.should.have.status(200);
    response.body.should.not.be.empty;
    response.body.should.be.jsonSchema(todosSchema);
    response.body.length.should.be.equal(2);
  });

});
