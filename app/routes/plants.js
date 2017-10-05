/* Load Models */
const User   = require('../models/user');
const Grow   = require('../models/grow');
const Strain = require('../models/strain');
const Plant  = require('../models/plant');

/* Middleware */
const loginRequired = require('../middleware/loginRequired');
const adminRequired = require('../middleware/adminRequired');

module.exports = function(app) {


    // Edit Plant Page
    app.get('/plants/:plantId/edit', loginRequired, getPlantById, function(req, res) {
        res.render('plants/edit.ejs', {
            title : "Edit Plant"
        });
    });

    app.post('/plants/:plantId/edit', loginRequired, getPlantById, function(req, res) {
        Plant
        .findOne({_id: req.params.plantId})   
        .exec((error, plant) => {
            if(error){ console.log(error); }
            
            plant.name = req.body.name;
            plant.description = req.body.description;
            plant.save((err) => {
                if(err){ console.log(err); }
                res.redirect(`/plants/${plant._id}`);
            });
        });        
    });

    // Delete Plant
    app.get('/plants/:plantId/delete', loginRequired, getPlantById, function(req, res) {
        if(String(req.user._id) === String(res.locals.plant.user._id)){
            Plant.findOneAndRemove({'_id': req.params.plantId}, function (error) {
                if(error){ console.log(error); }
                res.redirect('/profile'); 
            });
        } else {
            res.redirect(`/plants/${req.params.plantId}/edit`);
        }    
    });

    // Plant Profile Page
    app.get('/plants/:plantId', loginRequired, getPlantById, function(req, res) {
        res.render('plants/show.ejs', {
            title : "Plant Profile"
        });
    });

    // List Plants Page
    app.get('/plants', loginRequired, adminRequired, getAllPlants, function(req, res) {
        res.render('plants/list.ejs', {
            title : "All Plants"
        });
    });

}; // end module export

function getAllPlants(req,res,next){
    Plant
    .find({},{},{sort: {createdAt: -1}})
    .populate('user')
    .populate('grow')
    .populate('strain')
    .exec((error, plants) => {
        if(error){ console.log(error); }
        res.locals.plants = plants;
        next();
    });
};

function getPlantById(req,res,next){
    Plant
    .findOne({_id: req.params.plantId})
    .populate('user')
    .populate('grow')
    .populate('strain')   
    .exec((error, plant) => {
        if(error){ console.log(error); }
        res.locals.plant = plant;
        next();
    });
};

function getCurrentUserPlants(req,res,next){
    Plant
    .find({user: req.user._id})
    .populate('user')
    .populate('grow')
    .populate('strain')   
    .exec((error, plants) => {
        if(error){ console.log(error); }
        res.locals.plants = plants;
        next();
    });
};