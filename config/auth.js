// module.exports = {
//     ensureAuthenticated: function(req,res,next) {
//         if(req.isAuthenticated()) {
//             return next();
//         }
//         req.flash('error_msg', 'Please login to view this resource');
//         res.redirect('/users/login');
//         res.status(401).send({err_msg: 'Your not authorized'});
//     }
// }
const passport = require('passport');
module.exports = {
    ensureAuthenticated: passport.authenticate('jwt', {session: false})
};