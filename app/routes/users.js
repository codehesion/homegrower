/* Load Models */
const User     = require('../models/user');

/* Middleware */
const loginRequired = require('../middleware/loginRequired');
const adminRequired = require('../middleware/adminRequired');

module.exports = function(app) {

    // User Profile Page
    app.get('/profile', loginRequired, function(req, res) {
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