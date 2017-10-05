const mongoose = require('mongoose');
const moment   = require('moment');

const growSchema = mongoose.Schema({
    user: { type: String, ref: "User" },
    plants: [{ type: String, ref: "Plant" }],
    stage: { type: String, default: "seeding" },
    isComplete: { type: Boolean, default: false }
});

growSchema.methods.createdFromNow = function() {
    return moment(this.local.createdAt).fromNow();
};

module.exports = mongoose.model('Grow', growSchema);