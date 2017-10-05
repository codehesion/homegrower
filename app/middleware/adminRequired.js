module.exports = function(req, res, next) {
    /* Make Sure User Is Admin */
    /* If User Is Authenticated In Session & Admin*/
    if (req.user.isAdmin){
        /* Continue */
        return next();
    } else {
    	req.flash('loginMessage', 'You must be an admin to access this content!');
        /* If Not Authenticated & Admin, Redirect To Login Page */
        res.redirect('/sign-in'); 
    } 	
};