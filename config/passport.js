const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

passport.use(
  new localStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password does not match" });
          }
        });
      })
      .catch(err => console.log(err));
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = require("../config/keys").secret;
passport.use(
  "jwt",
  new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.userId)
      .then(user => {
          if (!user) {
              return done(null, false);
          }
          if (user) {
              return done(null, user);
          } else {
              return done(null, false);
          }
      })
      .catch(err => done(err, false))
  })
);
