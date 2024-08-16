'use strict';

const express = require('express');
const router = express.Router();
const { createIssue, getIssues, updateIssue, deleteIssue } = require('../controllers/issueController');


module.exports = function (app) {
  app.route('/api/issues/:project')
    .get(getIssues)
    .post(createIssue)
    .put(updateIssue)
    .delete(deleteIssue);
};
