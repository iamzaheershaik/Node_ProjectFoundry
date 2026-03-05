const passport = require('passport');
const Admin = require("../model/admin.model");
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    let admin = await Admin.findOne({ email: email })
    if (!admin) {
        return done(null, false);
    }
    let matchPass = await bcrypt.compare(password, admin.password)
    if (!matchPass) {
        return done(null, false);
    }
    return done(null, admin);
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    let admin = await Admin.findById(id);
    if (admin) {
        return done(null, admin);
    }
})

passport.checkAuthenticate = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect("/");
    }
}

passport.setAuthenticate = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;
