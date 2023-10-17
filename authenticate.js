const passport = require('passport')
const userModel = require('./models/userModel')
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})

passport.use(new GoogleStrategy({
    clientID: '933488544311-38e0hbccon0oe1m0p1cnc3adu28h3feu.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:4000/auth/google/callback",
    scope : ["profile","email"]
  },
  function(accessToken, refreshToken, profile, cb) {
    // u
    console.log(profile);
    cb(null,profile)
  }
));