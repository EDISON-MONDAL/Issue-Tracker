'use strict';

const mongoose = require('mongoose')

const dbSchema = new mongoose.Schema({
    issue_title: { type: String, default: '' },
    issue_text: { type: String, default: '' },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    created_by: { type: String, default: '' },
    assigned_to: { type: String, default: '' },
    open: { type: Boolean, default: true },
    status_text: { type: String, default: '' },
})
//module.exports = mongoose.model('issues', dbSchema)


//const issuesDBschema = require('../schema/schema')

module.exports = function (app) {

  app.route('/api/issues/:project') 

    .get(async function (req, res){
      const {_id, issue_title, issue_text, created_on, updated_on, created_by, assigned_to, open, status_text} = req.query
      let project = req.params.project;

            
      let queryDB = {}

      if( _id || issue_title || issue_text || created_on || updated_on || created_by || assigned_to || open || status_text){
        if(_id){
          queryDB['_id'] = _id
        }
        if(issue_title){
          queryDB['issue_title'] = issue_title
        }
        if(issue_text){
          queryDB['issue_text'] = issue_text
        }
        if(created_on){
          queryDB['created_on'] = created_on
        }
        if(updated_on){
          queryDB['updated_on'] = updated_on
        }
        if(created_by){
          queryDB['created_by'] = created_by
        }
        if(assigned_to){
          queryDB['assigned_to'] = assigned_to
        }
        if(open){
          queryDB['open'] = open
        }
        if(status_text){
          queryDB['status_text'] = status_text
        }
      }
      
      await mongoose.model(project, dbSchema).find(
        queryDB
        //'_id issue_title issue_text created_on updated_on created_by assigned_to open status_text'
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
      let project = req.params.project;
      
      if(issue_title && issue_text && created_by){
        const putIssueInMongo = new mongoose.model(project, dbSchema)({
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
    
    .put(async function (req, res){
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open} = req.body
      let project = req.params.project;
      
      if(_id){ 
        if(issue_title || issue_text || created_by || assigned_to || status_text || open){
            const updates = {
              updated_on: new Date()
            }
            if(issue_title){
              updates['issue_title'] = issue_title
            }
            if(issue_text){
              updates['issue_text'] = issue_text
            }
            if(created_by){
              updates['created_by'] = created_by
            }
            if(assigned_to){
              updates['assigned_to'] = assigned_to
            }
            if(status_text){
              updates['status_text'] = status_text
            }
            if(open){
              updates['open'] = open
            }



            await mongoose.model(project, dbSchema).findByIdAndUpdate(_id, updates, { new: true, useFindAndModify: false })
            .then(()=>{
              res.json({  result: 'successfully updated', '_id': _id })
            })
            .catch((err)=>{
              res.json({ error: 'could not update', '_id': _id })
            })
        } else {
          res.json({ error: 'no update field(s) sent', '_id': _id })
        }

      }  else {
        res.json({ error: 'missing _id' })
      }
      
    })
    
    .delete(async function (req, res){
      const { _id} = req.body
      let project = req.params.project;
      
      if(_id){ 
        await mongoose.model(project, dbSchema).findOneAndDelete({ _id: _id })
        .then(()=>{
          res.json({ result: 'successfully deleted', '_id': _id })
        })
        .catch((err)=>{
          res.json({ error: 'could not delete', '_id': _id })
        })

      }  else {
        res.json({ error: 'missing _id' })
      }
    });
    
};
