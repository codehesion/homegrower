const mongoose = require('mongoose');
const moment   = require('moment');

const strainSchema = mongoose.Schema({ 
    createdAt: String,
    category: String,
    name: String,
    description: String,
    averageFloweringTime: String
});

strainSchema.methods.createdFromNow = function() {
    return moment(this.local.createdAt).fromNow();
};

module.exports = mongoose.model('Strain', strainSchema);