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



module.exports = mongoose.model('issues', dbSchema)