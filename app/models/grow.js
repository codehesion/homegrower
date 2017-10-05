const mongoose = require('mongoose');
const moment   = require('moment');

const growSchema = mongoose.Schema({
    createdAt: { type: String, default: String(new Date()) },
    user: { type: String, ref: "User" },
    name: String,
    description: String,
    plants: [{ type: String, ref: "Plant" }],
    yield: { type: Number, default: 0 },
    isComplete: { type: Boolean, default: false }
});

growSchema.methods.createdFromNow = function() {
    return moment(this.createdAt).fromNow();
};

module.exports = mongoose.model('Grow', growSchema);