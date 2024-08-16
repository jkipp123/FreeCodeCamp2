const issues = [
    {
      _id: '1',
      issue_title: 'Initial Issue',
      issue_text: 'This is an initial issue',
      created_by: 'Tester',
      assigned_to: 'Developer',
      status_text: 'In Progress',
      created_on: new Date(),
      updated_on: new Date(),
      open: true,
      project: 'test'
    }
  ]; // This will act as our in-memory database for now
  
  // Create an issue
  const createIssue = (req, res) => {
    const project = req.params.project;
    const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
  
    if (!issue_title || !issue_text || !created_by) {
      return res.json({ error: 'required field(s) missing' });
    }
  
    const newIssue = {
      _id: new Date().getTime().toString(),
      issue_title,
      issue_text,
      created_by,
      assigned_to: assigned_to || '',
      status_text: status_text || '',
      created_on: new Date(),
      updated_on: new Date(),
      open: true,
      project
    };
  
    issues.push(newIssue);
    res.json(newIssue);
  };
  
  // View issues on a project
  const getIssues = (req, res) => {
    const project = req.params.project;
    let filteredIssues = issues.filter(issue => issue.project === project);
  
    // Apply filters if any
    const query = req.query;
    if (Object.keys(query).length > 0) {
      filteredIssues = filteredIssues.filter(issue => {
        return Object.keys(query).every(key => issue[key] == query[key]);
      });
    }
  
    res.json(filteredIssues);
  };
  
  // Update an issue
  const updateIssue = (req, res) => {
    const project = req.params.project;
    const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
  
    console.log(`Updating issue with _id: ${_id}`); // Added logging
  
    if (!_id) {
      console.log('Error: missing _id'); // Added logging
      return res.json({ error: 'missing _id' }); // Updated: Added error message for missing _id
    }
  
    const issue = issues.find(issue => issue._id === _id && issue.project === project);
  
    if (!issue) {
      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && open === undefined) {
        console.log(`Error: no update field(s) sent for _id: ${_id}`); // Added logging
        return res.json({ error: 'no update field(s) sent', _id }); // Updated: Added error message for no fields to update
      }
      console.log(`Error: could not update, issue not found with _id: ${_id}`); // Added logging
      return res.json({ error: 'could not update', _id }); // Updated: Added error message for issue not found
    }
  
    if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && open === undefined) {
      console.log(`Error: no update field(s) sent for _id: ${_id}`); // Added logging
      return res.json({ error: 'no update field(s) sent', _id }); // Updated: Added error message for no fields to update
    }
  
    issue.issue_title = issue_title || issue.issue_title;
    issue.issue_text = issue_text || issue.issue_text;
    issue.created_by = created_by || issue.created_by;
    issue.assigned_to = assigned_to || issue.assigned_to;
    issue.status_text = status_text || issue.status_text;
    issue.open = open !== undefined ? open : issue.open;
    issue.updated_on = new Date();
  
    console.log(`Issue updated: ${JSON.stringify(issue)}`); // Added logging
  
    res.json({ result: 'successfully updated', _id }); // Updated: Added success message
  };
  
  // Delete an issue
  const deleteIssue = (req, res) => {
    const project = req.params.project;
    const { _id } = req.body;
  
    console.log(`Deleting issue with _id: ${_id}`); // Added logging
  
    if (!_id) {
      console.log('Error: missing _id'); // Added logging
      return res.json({ error: 'missing _id' }); // Updated: Added error message for missing _id
    }
  
    const index = issues.findIndex(issue => issue._id === _id && issue.project === project);
  
    if (index === -1) {
      console.log(`Error: could not delete, issue not found with _id: ${_id}`); // Added logging
      return res.json({ error: 'could not delete', _id }); // Updated: Added error message for issue not found
    }
  
    issues.splice(index, 1);
  
    console.log(`Issue deleted with _id: ${_id}`); // Added logging
  
    res.json({ result: 'successfully deleted', _id }); // Updated: Added success message
  };
  
  module.exports = { createIssue, getIssues, updateIssue, deleteIssue };
  