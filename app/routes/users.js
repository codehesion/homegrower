/* Load Models */
const User  = require('../models/user');
const Grow  = require('../models/grow');
const Plant = require('../models/plant');

/* Middleware */
const loginRequired = require('../middleware/loginRequired');
const adminRequired = require('../middleware/adminRequired');

module.exports = function(app) {

    // User Profile Page
    app.get('/profile', loginRequired, getCurrentUserGrows, function(req, res) {
        res.render('users/profile.ejs', {
            title : `${req.user.local.username}'s Profile`,
            profileUser : req.user
        });
    });

    // User Profile Page
    app.get('/users/:username', loginRequired, function(req, res) {
        User
        .findOne({'local.username': req.params.username})
        .exec((error, profileUser) => {
        	if(error){ console.log(error); }
	        res.render('users/profile.ejs', {
	            title : `${profileUser.local.username}'s Profile`,
	            profileUser : profileUser
	        });
        });
    });

}; // end module export

function getCurrentUserGrows(req,res,next){
    Grow
    .find({user: req.user._id})
    .exec((error, grows) => {
        if(error){ console.log(error); }
        res.locals.grows = grows;
        next();
    });
};