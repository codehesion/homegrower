const mongoose = require('mongoose');
const moment   = require('moment');

const strainSchema = mongoose.Schema({ 
    createdAt: { type: String, default: String(new Date()) },
    category: String,
    name: String,
    description: String,
    growDifficulty: String,
    averageGrowHeight: String,
    averageFloweringTime: String,
    averageYield: String
});

strainSchema.methods.createdFromNow = function() {
    return moment(this.createdAt).fromNow();
};

module.exports = mongoose.model('Strain', strainSchema);