const express = require('express');
const router = express.Router();

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
        res.send('pass');
    }
});

module.exports = router;