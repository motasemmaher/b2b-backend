const bcrypt = require('bcrypt')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/model/User');
const GarageOwner = require('../models/model/GarageOwner');
const CarOwner = require('../models/model/CarOwner');

module.exports = {
    login() {
        passport.use(new LocalStrategy(
            function (username, password, done) {
                User.findUserByUsername(username).then((user) => {
                    if (!user) {
                        return done(null, false);
                    }
                    bcrypt.compare(password, user.password, (err, matched) => {
                        if(err) throw err;
                        if(matched) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    });                    
                }).catch(err => {
                    console.log(err);
                });
            }
        ));
        
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
          
        passport.deserializeUser(function(id, done) {
            User.getUser({_id: id}).then((user, err) => {                
                done(err, user);
            });
        }); 

        // res.json("note: hello");
    }
}
