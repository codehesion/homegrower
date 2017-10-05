const mongoose = require('mongoose');
const moment   = require('moment');

const plantSchema = mongoose.Schema({
    user: { type: String, ref: "User" },
    grow: { type: String, ref: "Grow" },
    strain: { type: String, ref: "Strain" },
    name: String,
    health: { type: Number, default: 100 },
    stage: { type: String, default: "seeding" },
    yield: { type: Number, default: 0 },
    isComplete: { type: Boolean, default: false }
});

plantSchema.methods.createdFromNow = function() {
    return moment(this.createdAt).fromNow();
};

module.exports = mongoose.model('Plant', plantSchema);