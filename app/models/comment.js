const mongoose = require('mongoose');
const moment   = require('moment');

const commentSchema = mongoose.Schema({
    user: { type: String, ref: "User" },
    createdAt: { type: String, default: String(new Date()) },
    category: String,
    profileUser: { type: String, ref: "User" },
    grow: { type: String, ref: "Grow" },
    strain: { type: String, ref: "Strain" },
    plant: { type: String, ref: "Plant" },
    content: String
});


commentSchema.methods.createdFromNow = function() {
    return moment(this.createdAt).fromNow();
};

module.exports = mongoose.model('Comment', commentSchema);