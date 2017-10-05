/* Load Models */
const User  = require('../models/user');
const Grow  = require('../models/grow');
const Plant = require('../models/plant');

/* Middleware */
const loginRequired = require('../middleware/loginRequired');
const adminRequired = require('../middleware/adminRequired');

module.exports = function(app) {

    // New Grow Page
    app.get('/grows/new', loginRequired, getAllGrows, function(req, res) {
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
            res.redirect('/grows');
        });
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
    .exec((error, grows) => {
        if(error){ console.log(error); }
        res.locals.grows = grows;
        next();
    });
};

function getGrowById(req,res,next){
    Grow
    .findOne({_id: req.params.growId})
    .exec((error, grow) => {
        if(error){ console.log(error); }
        res.locals.grow = grow;
        next();
    });
};

function getCurrentUserGrows(req,res,next){
    Grow
    .find({user: req.user._id})
    .exec((error, grows) => {
        if(error){ console.log(error); }
        res.locals.grows = grows;
        next();
    });
};