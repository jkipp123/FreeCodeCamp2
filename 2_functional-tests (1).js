const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST /api/issues/{project} => object with issue data', function() {
    test('Create an issue with every field', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          done();
        });
    });

    test('Create an issue with only required fields', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Required fields');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          done();
        });
    });

    test('Create an issue with missing required fields', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });

  suite('GET /api/issues/{project} => Array of objects with issue data', function() {
    test('View issues on a project', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test('View issues on a project with one filter', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({ open: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test('View issues on a project with multiple filters', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({ open: true, created_by: 'Functional Test - Required fields' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
  });

  suite('PUT /api/issues/{project} => text', function() {
    test('Update one field on an issue', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '1', // Ensure this ID exists in your in-memory database
          issue_title: 'Updated Title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated'); // Updated: Added assertion for success message
          done();
        });
    });
  
    test('Update multiple fields on an issue', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '1', // Ensure this ID exists in your in-memory database
          issue_title: 'Updated Title',
          issue_text: 'Updated text'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated'); // Updated: Added assertion for success message
          done();
        });
    });
  
    test('Update an issue with missing _id', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          issue_title: 'Updated Title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id'); // Updated: Added assertion for error message
          done();
        });
    });
  
    test('Update an issue with no fields to update', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '1' // Ensure this ID exists in your in-memory database
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: '1' }); // Updated: Added assertion for error message
          done();
        });
    });
  
    test('Update an issue with an invalid _id', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'invalid_id',
          issue_title: 'Updated Title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not update', _id: 'invalid_id' }); // Updated: Added assertion for error message
          done();
        });
    });
  });
  
  suite('DELETE /api/issues/{project} => text', function() {
    test('Delete an issue', function(done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: '1' // Ensure this ID exists in your in-memory database
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted'); // Updated: Added assertion for success message
          done();
        });
    });
  
    test('Delete an issue with an invalid _id', function(done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: 'invalid_id'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete'); // Updated: Added assertion for error message
          done();
        });
    });
  
    test('Delete an issue with missing _id', function(done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id'); // Updated: Added assertion for error message
          done();
        });
    });
  });
  
});
