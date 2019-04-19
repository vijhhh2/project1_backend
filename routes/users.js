const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

// register post route
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please provide all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password length should be 6 atleast" });
  }
  if (errors.length > 0) {
    res.status(400).send(errors);
  } else {
    const newUser = User({
      name,
      email,
      password
    });
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          res.status(400).send({ msg: "User exists already" });
        } else {
          // hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              //set password to hash
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                    const token = jwt.sign({userId: user._id}, require('../config/keys').secret);
                    res
                    .status(200)
                    .send({ id: user._id, name: user.name, email: user.email, token: token });
                })
                .catch(err => console.log(err));
            });
          });
        }
      })
      .catch(err => errors.push({ msg: "Server Error" }));
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(400).send({
        message: "Something is not right",
        user: user
      });
    }
    if (!user) {
      return res
        .status(400)
        .send({ message: "username and password does not match" });
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      const { _id, name, email } = req.user;
      const token = jwt.sign({userId: _id}, require('../config/keys').secret);
      res.send({
        id: _id,
        name,
        email,
        token
      });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Logout successfully");
  res.redirect("/users/login");
  res.status(200).send({ success_msg: "Logout Successful" });
});

module.exports = router;
