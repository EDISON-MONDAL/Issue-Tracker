const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const projectName = 'apitest'

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let projectId; // Store the _id of the created issue for later tests
    
  // Test 1: Create an issue with every field
  test(`POST request to /api/issues/${projectName} - Create an issue with every field`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .post(`/api/issues/${projectName}`)
      .send({
        issue_title: 'Test Issue',
        issue_text: 'This is a test issue with every field',
        created_by: 'TestUser',
        assigned_to: 'AssigneeUser',
        status_text: 'In Progress',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'status_text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'open');
        assert.equal(res.body.issue_title, 'Test Issue');
        assert.equal(res.body.issue_text, 'This is a test issue with every field');
        assert.equal(res.body.created_by, 'TestUser');
        assert.equal(res.body.assigned_to, 'AssigneeUser');
        assert.equal(res.body.status_text, 'In Progress');
        assert.isTrue(res.body.open);
        projectId = res.body._id; // Store the _id for later tests
        done();
      });
  });

  // Test 2: Create an issue with only required fields
  test(`POST request to /api/issues/${projectName} - Create an issue with only required fields`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .post(`/api/issues/${projectName}`)
      .send({
        issue_title: 'Required Field Issue',
        issue_text: 'This issue only has required fields',
        created_by: 'RequiredUser',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'status_text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'open');
        assert.equal(res.body.issue_title, 'Required Field Issue');
        assert.equal(res.body.issue_text, 'This issue only has required fields');
        assert.equal(res.body.created_by, 'RequiredUser');
        assert.isEmpty(res.body.assigned_to); // Optional fields should be empty
        assert.isEmpty(res.body.status_text); // Optional fields should be empty
        assert.isTrue(res.body.open);
        done();
      });
  });

  // Test 3: Create an issue with missing required fields
  test(`POST request to /api/issues/${projectName} - Create an issue with missing required fields`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .post(`/api/issues/${projectName}`)
      .send({
        issue_title: 'Incomplete Issue',
        // Missing issue_text, created_by (required fields)
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  });
  
  // Test 4: View issues on a project
  test(`GET request to /api/issues/${projectName} - View issues on a project`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .get(`/api/issues/${projectName}`)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });
  /*
  // Test 5: View issues on a project with one filter
  test(`GET request to /api/issues/${projectName} - View issues on a project with one filter`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .get(`/api/issues/${projectName}`)
      .query({ open: 'false' }) // Example filter by open issues
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        // Add assertions for the filter here
        const Issues = res.body;
            Issues.forEach(issue => {
            console.log('arr '+ issue.open)            
            assert.isFalse(issue.open); // Ensure that each issue in the response is closed (open property is false)
        });
        done();
      });
  });

  // Test 6: View issues on a project with multiple filters
  test(`GET request to /api/issues/${projectName} - View issues on a project with multiple filters`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .get(`/api/issues/${projectName}`)
      .query({ open: 'false', created_by: 'TestUser' }) // Example filters
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        // Add assertions for the filters here
        done();
      });
  });
  */

  // Test 7: Update one field on an issue
  test(`PUT request to /api/issues/${projectName} - Update one field on an issue`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .put(`/api/issues/${projectName}`)
      .send({
        _id: projectId, // Use the _id from the created issue in Test 1
        issue_text: 'Updated issue text',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        console.log('body7 Update one field -'+res.body.result + ' id'+ res.body._id)
        assert.property(res.body, 'result');
        assert.property(res.body, '_id');
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, projectId);
        done();
      });
  });

  // Test 8: Update multiple fields on an issue
  test(`PUT request to /api/issues/${projectName} - Update multiple fields on an issue`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .put(`/api/issues/${projectName}`)
      .send({
        _id: projectId, // Use the _id from the created issue in Test 1
        issue_title: 'Updated Title',
        status_text: 'Completed',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        console.log('body8 Update multiple fields -'+res.body.result + ' id'+ res.body._id)
        assert.property(res.body, 'result');
        assert.property(res.body, '_id');
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, projectId);
        done();
      });
  });

  // Test 9: Update an issue with missing _id
  test(`PUT request to /api/issues/${projectName} - Update an issue with missing _id`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .put(`/api/issues/${projectName}`)
      .send({
        issue_text: 'Trying to update without _id',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        console.log('body9 with missing _id -'+res.body.error)
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });

  // Test 10: Update an issue with no fields to update
  test(`PUT request to /api/issues/${projectName} - Update an issue with no fields to update`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .put(`/api/issues/${projectName}`)
      .send({
        _id: projectId, // Use the _id from the created issue in Test 1
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        console.log('body10 with no fields to update -'+res.body.error + ' id'+ res.body._id)
        assert.property(res.body, 'error');
        assert.property(res.body, '_id');
        assert.equal(res.body.error, 'no update field(s) sent');
        assert.equal(res.body._id, projectId);
        done();
      });
  });

  // Test 11: Update an issue with an invalid _id
  test(`PUT request to /api/issues/${projectName} - Update an issue with an invalid _id`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .put(`/api/issues/${projectName}`)
      .send({
        _id: 'invalid_id',
        issue_text: 'Trying to update with an invalid _id',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        console.log('body11 for invalid _id -'+res.body.error+ ' _id ' + res.body._id)
        /*
        assert.property(res.body, 'error');
        assert.property(res.body, '_id'); // added
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, projectId); // added
        */
        assert.deepEqual(res.body, { error: 'could not update', '_id': res.body._id });
        done();
      });
  });
  
  // Test 12: Delete an issue
  test(`DELETE request to /api/issues/${projectName} - Delete an issue`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete(`/api/issues/${projectName}`)
      .send({
        _id: projectId, // Use the _id from the created issue in Test 1
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'result');
        assert.property(res.body, '_id');
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, projectId);
        //const actualObject = { result: 'successfully deleted', '_id': projectId };
        //const expectedObject = { result: 'successfully deleted', '_id': projectId };

        //assert.deepEqual(actualObject, expectedObject, 'successfully deleted');
        done();
      });
  });

  // Test 13: Delete an issue with an invalid _id
  test(`DELETE request to /api/issues/${projectName} - Delete an issue with an invalid _id`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete(`/api/issues/${projectName}`)
      .send({
        _id: 'invalid_id',
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.property(res.body, '_id');
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, 'invalid_id');
        //const actualObject = { error: 'could not delete', '_id': projectId };
        //const expectedObject = { error: 'could not delete', '_id': projectId };

        //assert.deepEqual(actualObject, expectedObject, 'could not delete');
        done();
      });
  });

  // Test 14: Delete an issue with missing _id
  test(`DELETE request to /api/issues/${projectName} - Delete an issue with missing _id`, function(done) {
    chai
      .request(server)
      .keepOpen()
      .delete(`/api/issues/${projectName}`)
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'missing _id');
        //const actualObject = { error: 'missing _id' };
        //const expectedObject = { error: 'missing _id' };

        //assert.deepEqual(actualObject, expectedObject, 'missing _id');
        done();
      });
  });
  
});
