/* Load Models */
const User   = require('../models/user');
const Grow   = require('../models/grow');
const Strain = require('../models/strain');
const Plant  = require('../models/plant');

/* Middleware */
const loginRequired = require('../middleware/loginRequired');
const adminRequired = require('../middleware/adminRequired');

module.exports = function(app) {

    // New Grow Page
    app.get('/grows/new', loginRequired, function(req, res) {
        res.render('grows/new.ejs', {
            title : "New Grow"
        });
    });

    app.post('/grows/new', loginRequired, function(req, res) {
        let newGrow = new Grow({
            user: req.user._id,
            name: req.body.name,
            description: req.body.description
        });
        newGrow.save((error) => {
            if(error){ console.log(error); }
            res.redirect('/profile');
        });
    });

    // New Plant Page
    app.get('/grows/:growId/new-plant', loginRequired, getAllStrains, function(req, res) {
        res.render('plants/new.ejs', {
            title : "New Plant"
        });
    });

    app.post('/grows/:growId/new-plant', loginRequired, function(req, res) {
        let newPlant = new Plant({
            user: req.user._id,
            grow: req.params.growId,
            strain: req.body.strain,
            name: req.body.name,
            description: req.body.description
        });
        newPlant.save((error, plant) => {
            if(error){ console.log(error); }
            Grow
            .findOne({_id: req.params.growId })
            .exec((err, grow) => {
                grow.plants.push(plant._id);
                grow.save((error) => {
                    if(error){ console.log(error); }
                    res.redirect(`/grows/${req.params.growId}`);
                });
            });
        });
    });

    // Edit Grow Page
    app.get('/grows/:growId/edit', loginRequired, getGrowById, function(req, res) {
        res.render('grows/edit.ejs', {
            title : "Edit Grow"
        });
    });

    app.post('/grows/:growId/edit', loginRequired, getGrowById, function(req, res) {
        Grow
        .findOne({_id: req.params.growId})
        .populate('user')
        .populate('plants')    
        .exec((error, grow) => {
            if(error){ console.log(error); }
            grow.name = req.body.name;
            grow.description = req.body.description;
            grow.save((err) => {
                if(err){ console.log(err); }
                res.redirect(`/grows/${grow._id}`);
            });
        });        
    });

    // Delete Grow
    app.get('/grows/:growId/delete', loginRequired, getGrowById, function(req, res) {
        console.log(`User ID: ${req.user._id}`);
        console.log(`Grow User ID: ${res.locals.grow.user._id}`);
        if(String(req.user._id) === String(res.locals.grow.user._id)){
            Grow.findOneAndRemove({'_id': req.params.growId}, function (error) {
                if(error){ console.log(error); }
                res.redirect('/profile'); 
            });
        } else {
            res.redirect(`/grows/${req.params.growId}/edit`);
        }    
    });

    // Grow Profile Page
    app.get('/grows/:growId', loginRequired, getGrowById, function(req, res) {
        res.render('grows/show.ejs', {
            title : "Grow Profile"
        });
    });

    // List Grows Page
    app.get('/grows', loginRequired, adminRequired, getAllGrows, function(req, res) {
        res.render('grows/list.ejs', {
            title : "All Grows"
        });
    });

}; // end module export

function getAllGrows(req,res,next){
    Grow
    .find({},{},{sort: {createdAt: -1}})
    .populate('user')
    .populate('plants')
    .exec((error, grows) => {
        if(error){ console.log(error); }
        res.locals.grows = grows;
        next();
    });
};

function getGrowById(req,res,next){
    Grow
    .findOne({_id: req.params.growId})
    .populate('user')
    .populate('plants')    
    .exec((error, grow) => {
        if(error){ console.log(error); }
        res.locals.grow = grow;
        next();
    });
};

function getCurrentUserGrows(req,res,next){
    Grow
    .find({user: req.user._id})
    .populate('user')
    .populate('plants')    
    .exec((error, grows) => {
        if(error){ console.log(error); }
        res.locals.grows = grows;
        next();
    });
};

function getAllStrains(req,res,next){
    Strain
    .find({},{},{sort: {name: 1}})
    .exec((error, strains) => {
        if(error){ console.log(error); }
        res.locals.strains = strains;
        next();
    });
};