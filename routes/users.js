const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

router.get('/login', (req,res) => res.render('login'));
router.get('/register', (req,res) => res.render('register'));

// register post route
router.post('/register', (req,res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please provide all fields'});
    }

    if(password !== password2) {
        errors.push({msg: 'Passwords do not match'})
    }

    if(password.length < 6) {
        errors.push({msg: 'Password length should be 6 atleast'})
    }
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        const  newUser = User({
            name,
            email,
            password
        })
        User.findOne({email: email})
        .then(user => {
            if (user) {
                errors.push({msg: 'User exists already'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
               // hash password
               bcrypt.genSalt(10, (err, salt) => {
                   bcrypt.hash(newUser.password, salt, (err, hash) => {
                       //set password to hash
                       newUser.password = hash;
                       newUser.save()
                       .then(user => {
                           req.flash('success_msg', 'Congrats now you are registered');
                           res.redirect('/users/login');
                       })
                       .catch(err => console.log(err));
                   });
               })
            }
        })
        .catch(err => errors.push({msg: 'Server Error'}))
    }
});


router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


router.get('/logout', (req,res) => {
    req.logOut();
    req.flash('success_msg', 'Logout successfully');
    res.redirect('/users/login');
});

module.exports = router;