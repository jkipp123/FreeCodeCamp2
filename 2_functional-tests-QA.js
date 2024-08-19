const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let testID;
  
  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .set('content-type','application/x-www-form-urlencoded')
          .send({title: 'Chai Book'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, '_id', 'response should contain _id');
            assert.property(res.body, 'title', 'response should contain title');
            testID = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .set('content-type','application/x-www-form-urlencoded')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200); // Adjusted to match the provided api.js response
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
      
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books', function(done){
        chai.request(server)
          .keepOpen()
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db', function(done){
        chai.request(server)
          .keepOpen()
          .get('/api/books/invalidid')
          .end(function(err, res){
            assert.equal(res.status, 200); // Adjusted to match the provided api.js response
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .keepOpen()
          .get(`/api/books/${testID}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            assert.property(res.body, 'comments', 'Book should have comments property');
            done();
          });
      });
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .keepOpen()
          .post(`/api/books/${testID}`)
          .set('content-type','application/x-www-form-urlencoded')
          .send({comment: 'Test comment'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'comments', 'response should contain comments');
            assert.include(res.body.comments, 'Test comment');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .keepOpen()
          .post(`/api/books/${testID}`)
          .set('content-type','application/x-www-form-urlencoded')
          .send({comment: ''})
          .end((err, res) => {
            assert.equal(res.status, 200); // Adjusted to match the provided api.js response
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .keepOpen()
          .post('/api/books/invalidid')
          .set('content-type','application/x-www-form-urlencoded')
          .send({comment: 'failed comment'})
          .end((err, res) => {
            assert.equal(res.status, 200); // Adjusted to match the provided api.js response
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .keepOpen()
          .delete(`/api/books/${testID}`)
          .set('content-type','application/x-www-form-urlencoded')
          .send({id: testID})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai.request(server)
          .keepOpen()
          .delete('/api/books/invalidid')
          .end((err, res) => {
            assert.equal(res.status, 200); // Adjusted to match the provided api.js response
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
