var request = require('supertest');
describe('loading express', function () {
  var promise;
  beforeEach(function() {
    promise = require('../app/index').start();
  });

  afterEach(function () {
    promise.then(function(server){
      server.close();
    });
  });

  it('responds to /', function index(done) {
    promise.then(function(server){
      request(server).get('/').expect(200, done);
    });
  });

  it('responds to /embed/treemap/test', function index(done) {
    promise.then(function(server){
      request(server).get('/embed/treemap/test').expect(200, done);
    });
  });


  it('responds to /embed/piechart/test', function index(done) {
    promise.then(function(server){
      request(server).get('/embed/piechart/test').expect(200, done);
    });
  });

  it('responds to /embed/barchart/test', function index(done) {
    promise.then(function(server){
      request(server).get('/embed/barchart/test').expect(200, done);
    });
  });

  it('responds to /embed/linechart/test', function index(done) {
    promise.then(function(server){
      request(server).get('/embed/linechart/test').expect(200, done);
    });
  });

  it('responds to /embed/bubbletree/test', function index(done) {
    promise.then(function(server){
      request(server).get('/embed/bubbletree/test').expect(200, done);
    });
  });

  it('responds to /embed/table/test', function index(done) {
    promise.then(function(server){
      request(server).get('/embed/table/test').expect(200, done);
    });
  });

  it('responds to /embed/map/test', function index(done) {
    promise.then(function(server){
      request(server).get('/embed/map/test').expect(200, done);
    });
  });


  it('responds 404 to /embed/mountainview/test', function index(done) {
    promise.then(function(server){
      request(server).get('/embed/mountainview/test').expect(404, done);
    });
  });


});