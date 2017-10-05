/* Load Models */
const User    = require('../models/user');
const Grow    = require('../models/grow');
const Strain  = require('../models/strain');
const Plant   = require('../models/plant');
const Comment = require('../models/comment');

/* Middleware */
const loginRequired = require('../middleware/loginRequired');
const adminRequired = require('../middleware/adminRequired');

module.exports = function(app) {

   // List Indica Strains Page
    app.get('/strains/indica', loginRequired, adminRequired, getAllIndicaStrains, function(req, res) {
        res.render('strains/list.ejs', {
            title : "List Indica Strains"
        });
    });

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


    // Leave Strain Comment
    app.post('/strains/:strainId/leave-comment', loginRequired, function(req, res) {
        let newComment = new Comment({
            user: req.user._id,
            category: "strain",
            strain: req.params.strainId,
            content: req.body.content
        });
        newComment.save((error) => {
            if(error){ console.log(error); }
            res.redirect(`/strains/${req.params.strainId}`);
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
    app.get('/strains/:strainId', loginRequired, getStrainById, getStrainComments, function(req, res) {
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

function getAllIndicaStrains(req,res,next){
    Strain
    .find({category: "indica"},{},{sort: {name: 1}})
    .exec((error, strains) => {
        if(error){ console.log(error); }
        res.locals.strains = strains;
        next();
    });   
};

function getAllIndicaHybridStrains(req,res,next){
    Strain
    .find({category: "indica leaning hybrid"},{},{sort: {name: 1}})
    .exec((error, strains) => {
        if(error){ console.log(error); }
        res.locals.strains = strains;
        next();
    });   
};

function getAllHybridStrains(req,res,next){
    Strain
    .find({category: "hybrid"},{},{sort: {name: 1}})
    .exec((error, strains) => {
        if(error){ console.log(error); }
        res.locals.strains = strains;
        next();
    });   
};

function getAllSativaHybridStrains(req,res,next){
    Strain
    .find({category: "sativa leaning hybrid"},{},{sort: {name: 1}})
    .exec((error, strains) => {
        if(error){ console.log(error); }
        res.locals.strains = strains;
        next();
    });   
};

function getAllSativaStrains(req,res,next){
    Strain
    .find({category: "sativa"},{},{sort: {name: 1}})
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

function getStrainComments(req,res,next){
    Comment
    .find({strain: req.params.strainId},{},{sort: {createdAt: -1}})
    .populate('user')
    .populate('profileUser')
    .populate('strain')
    .populate('grow')
    .populate('plant')
    .exec((error, comments) => {
        if(error){ console.log(error); }
        res.locals.comments = comments;
        next();
    });
};