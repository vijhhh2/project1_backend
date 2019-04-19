const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req,res) => res.render('welcome'));
router.get('/dashboard', ensureAuthenticated, (req,res) => {
    console.log(req.user)
     res.send(req.user);
});

module.exports = router;