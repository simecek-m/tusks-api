const chai = require('chai');
const chaiHttp = require('chai-http');
const jsonSchema = require('chai-json-schema');
const app = require('../app.js');
const should = chai.should();

const taskSchema = require('./schema/task');
const todoSchema = require('./schema/todo');
const todosSchema = require('./schema/todos');

chai.use(chaiHttp);
chai.use(jsonSchema);

describe('/todos', () => {
  it('should GET all todo lists', done => {
    chai.request(app)
      .get('/api/todos')
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.should.have.status(200);
        res.body.should.be.jsonSchema(todosSchema);
        done();
      });
  });
});

describe.skip('/todos', () => {
  it('should POST new todo list', done => {
    done(new Error('not implemented yet'));
  });
  it('should UPDATE specific todo list', done => {
    done(new Error('not implemented yet'));
  });
  it('should DELETE specific todo list', done => {
    done(new Error('not implemented yet'));
  });
});

describe.skip('/todos/:id/task', () => {
  it('should POST new task into todo list', done => {
    done(new Error('not implemented yet'));
  });
  it('should UPDATE specific task in todo list', done => {
    done(new Error('not implemented yet'));
  });
  it('should DELETE specific task in todo list', done => {
    done(new Error('not implemented yet'));
  });
});