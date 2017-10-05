/*******************/
/* Require Express */
/*******************/
const express = require('express');


/***********************/
/* Instantiate Express */
/***********************/
const app     = express();


/*******************/
/* Require Modules */
/*******************/
const mongoose     = require('mongoose');
const passport     = require('passport');
const flash        = require('connect-flash');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);

/*******************/
/* Set Port        */
/*******************/
// Set the port to the server default or 3000
const port = process.env.PORT || 3000;


/*********************/
/* Customize Express */
/*********************/

// Logs Every Request To The Console
app.use(morgan('dev'));

// Parse Cookies
app.use(cookieParser());

// Get Information From HTML Forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sets a static public folder
app.use(express.static(__dirname + '/public'));


/*********************/
/* View Engine       */
/*********************/

// Sets the templating to Embedded JavaScript(EJS)
app.set('view engine', 'ejs');

// Sets the default view directory
app.set('views', './app/views');



/***********************/
/* Connect To Database */
/***********************/

// If In Local Development, Include Environment Variables
if (!process.env.DB_URI){ require('./config/env.js'); }

// Set Connectino String From Environment Variables
const databaseConnectionString = 'mongodb://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_URI;

// Set Mongoose Promise
mongoose.Promise = global.Promise;

// Connect To Database
mongoose.connect(databaseConnectionString);



/*********************/
/* Passport          */
/*********************/

// Require Passport Configuration
require('./config/passport')(passport);

// Persistent Sessions Stored In Our Database
app.use(session({ 
	secret: 'codehesion',
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use Connect-Flash For Flash Messages
app.use(flash());

/******************/
/* Express Routes */
/******************/

// Catch All Routes - Logic Loaded On Every Route
require('./app/routes/catchAll.js')(app);

// Require Routes
require('./app/routes/static.js')(app);
require('./app/routes/passport.js')(app, passport);
require('./app/routes/users.js')(app);


/*****************/
/* Launch Server */
/*****************/
app.listen(port, function () {
	console.log(`Listening on port ${port}!`);
});