'use strict';

const issuesDBschema = require('../schema/schema')

module.exports = function (app) {

  app.route('/api/issues/:apitest')

    .get(async function (req, res){
      const {issue_title, issue_text, created_on, updated_on, created_by, assigned_to, open, status_text} = req.query
      let project = req.params.apitest;
      
      let query = {}

      if(issue_title || issue_text || created_on || updated_on || created_by || assigned_to || open || status_text){
        if(issue_title){
          query['issue_title'] = issue_title
        }
        if(issue_text){
          query['issue_text'] = issue_text
        }
        if(created_on){
          query['created_on'] = created_on
        }
        if(updated_on){
          query['updated_on'] = updated_on
        }
        if(created_by){
          query['created_by'] = created_by
        }
        if(assigned_to){
          query['assigned_to'] = assigned_to
        }
        if(open){
          query['open'] = open
        }
        if(status_text){
          query['status_text'] = status_text
        }
      }
      
      await issuesDBschema.find(
        query, 
        '_id issue_title issue_text created_on updated_on created_by assigned_to open status_text'
      )
      .then((data)=>{
          res.json(data)
      })
      .catch((err)=>{
        res.json({ error: 'Either empty or wrong query!'})
      })
      
    })
    
    .post(async function (req, res){
      const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body
      let project = req.params.apitest;
      
      if(issue_title && issue_text && created_by){
        const putIssueInMongo = new issuesDBschema({
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,            
        })
  
        try {      
          const objectId = await putIssueInMongo.save()          
          //console.log('issue created with id ' + objectId._id)

          res.json({
            _id: objectId._id,
            issue_title: objectId.issue_title, 
            issue_text: objectId.issue_text, 
            created_on: objectId.created_on,
            updated_on: objectId.updated_on,
            created_by: objectId.created_by, 
            assigned_to: objectId.assigned_to, 
            open: objectId.open,
            status_text: objectId.status_text, 
          })
      
        } catch(err) {      
          console.log('can\'t create issue in db ' + err.message)           
        }

      }else {
        res.json({ error: 'required field(s) missing' })
      }     
      
    })
    
    .put(function (req, res){
      let project = req.params.apitest;
      console.log(project)
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
