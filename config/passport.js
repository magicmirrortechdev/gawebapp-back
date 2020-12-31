const UserV2 = require('../v2/models/UserV2')
const passport = require('passport')

passport.use(UserV2.createStrategy())
passport.serializeUser(UserV2.serializeUser())
passport.deserializeUser(UserV2.deserializeUser())

module.exports = passport
