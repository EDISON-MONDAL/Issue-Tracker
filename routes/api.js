'use strict';


module.exports = function (app) {

  app.route('/api/issues/:apitest')

    .get(function (req, res){
      const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body
      let project = req.params.apitest;
      console.log(issue_title)
      
    })
    
    .post(async function (req, res){
      const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body
      let project = req.params.apitest;
      
      if(issue_title && issue_text && created_by){
        const putIssueInMongo = new require('../schema/schema')({
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
