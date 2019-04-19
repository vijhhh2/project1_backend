const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


// passport config require
require('./config/passport')(passport);


const app = express();

// db connection
const db = require('./config/keys').mongoUri;

mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('Mongodb connected'))
.catch(err => console.log(err))

// port
const port = process.env.PORT || 5000;

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body parser
app.use(express.urlencoded({extended: false}));

// session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));

//passport session
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash())

app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(port, console.log(`Server started on port ${port}`));