/* Load Models */
const User   = require('../models/user');
const Grow   = require('../models/grow');
const Strain = require('../models/strain');
const Plant  = require('../models/plant');

/* Middleware */
const loginRequired = require('../middleware/loginRequired');
const adminRequired = require('../middleware/adminRequired');

module.exports = function(app) {

    // New Strain Page
    app.get('/strains/new', loginRequired, adminRequired, function(req, res) {
        res.render('strains/new.ejs', {
            title : "New Strain"
        });
    });

    app.post('/strains/new', loginRequired, adminRequired, function(req, res) {
        let newStrain = new Strain({
            user: req.user._id,
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            growDifficulty: req.body.growDifficulty,
            averageGrowHeight: req.body.averageGrowHeight,
            averageYield: req.body.averageYield,
            averageFloweringTime: req.body.averageFloweringTime
        });
        newStrain.save((error) => {
            if(error){ console.log(error); }
            res.redirect('/strains');
        });
    });

    // Edit Strain Page
    app.get('/strains/:strainId/edit', loginRequired, getStrainById, function(req, res) {
        res.render('strains/edit.ejs', {
            title : "Edit Strain"
        });
    });

    app.post('/strains/:strainId/edit', loginRequired, getStrainById, function(req, res) {
        Strain
        .findOne({_id: req.params.strainId})  
        .exec((error, strain) => {
            if(error){ console.log(error); }
            strain.category = req.body.category;
            strain.name = req.body.name;
            strain.description = req.body.description;
            strain.growDifficulty = req.body.growDifficulty;
            strain.averageGrowHeight = req.body.averageGrowHeight;
            strain.averageYield = req.body.averageYield;
            strain.averageFloweringTime = req.body.averageFloweringTime;
            strain.save((err) => {
                if(err){ console.log(err); }
                res.redirect(`/strains/${strain._id}`);
            });
        });        
    });

    // Delete Strain
    app.get('/strains/:strainId/delete', loginRequired, adminRequired, function(req, res) {
        Strain.findOneAndRemove({'_id': req.params.strainId}, function (error) {
            if(error){ console.log(error); }
            res.redirect('/strains'); 
        });  
    });

    // Strain Profile Page
    app.get('/strains/:strainId', loginRequired, getStrainById, function(req, res) {
        res.render('strains/show.ejs', {
            title : "Strain Profile"
        });
    });

    // List Strains Page
    app.get('/strains', loginRequired, getAllStrains, function(req, res) {
        res.render('strains/list.ejs', {
            title : "All Strains"
        });
    });

}; // end module export

function getAllStrains(req,res,next){
    Strain
    .find({},{},{sort: {name: 1}})
    .exec((error, strains) => {
        if(error){ console.log(error); }
        res.locals.strains = strains;
        next();
    });
};

function getStrainById(req,res,next){
    Strain
    .findOne({_id: req.params.strainId})   
    .exec((error, strain) => {
        if(error){ console.log(error); }
        res.locals.strain = strain;
        next();
    });
};
