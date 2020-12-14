const bcrypt = require('bcrypt')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// const mongoose = require('mongoose');
// const UserSchema = require("../../src/model/schema/User");
// const User= mongoose.model('User', UserSchema);

const User = require('../models/model/User');
const GarageOwner = require('../models/model/GarageOwner');
const CarOwner = require('../models/model/CarOwner');

const mongoose = require('mongoose');
const {
    RateLimiterMongo,
    RateLimiterRes
} = require('rate-limiter-flexible');

const maxWrongAttemptsFromIPperDay = 1000;
const maxConsecutiveFailsByUsernameAndIP = 100;

const mongoConn = mongoose.connection;

const limiterSlowBruteByIP = new RateLimiterMongo({
    storeClient: mongoConn,
    keyPrefix: 'login_fail_ip_per_day',
    points: maxWrongAttemptsFromIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 3, // Block for 3 hours, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
    storeClient: mongoConn,
    keyPrefix: 'login_fail_consecutive_username_and_ip',
    points: maxConsecutiveFailsByUsernameAndIP,
    duration: 60 * 60 * 24 * 14, // Store number for 14 days since first fail
    blockDuration: 60 * 10, // Block for 10 minutes
});

module.exports = {
    login() {
        passport.use(new LocalStrategy({
                passReqToCallback: true,
            },
            async function (req, username, password, done) {
                const usernameIPkey = `${username}_${req.ip}`;
                let resUsernameAndIP;
                try {
                    let retrySecs = 0;

                    const resGet = await Promise.all([
                        limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
                        limiterSlowBruteByIP.get(req.ip),
                    ]);
                    resUsernameAndIP = resGet[0];
                    const resSlowByIP = resGet[1];
                    // Check if IP or Username + IP is already blocked
                    if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsFromIPperDay) {
                        retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
                    } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
                        retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
                    }

                    if (retrySecs > 0) {
                        return done(null, false, {
                            statusCode: 429,
                            retrySecs
                        })
                    }
                } catch (err) {
                    return done(err)
                }
                User.findUserByUsername(username).then(async (user) => {
                    if (!user) {
                        try {
                            await Promise.all([
                                limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey),
                                limiterSlowBruteByIP.consume(req.ip)
                            ])

                            return done(null, false)
                        } catch (rlRejected) {
                            if (rlRejected instanceof RateLimiterRes) {
                                return done(null, false, {
                                    statusCode: 429,
                                    retrySecs: Math.round(rlRejected.msBeforeNext / 1000) || 1
                                })
                            } else {
                                return done(rlRejected)
                            }
                        }
                    }
                    bcrypt.compare(password, user.password, async (err, matched) => {
                        if (err) throw err;
                        if (matched) {
                            if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
                                // Reset on successful authorisation
                                try {
                                    await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
                                } catch (err) {
                                    // handle err only when other than memory limiter used
                                }
                            }
                            return done(null, user);
                        } else {
                            try {
                                await Promise.all([
                                    limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey),
                                    limiterSlowBruteByIP.consume(req.ip)
                                ])

                                return done(null, false)
                            } catch (rlRejected) {
                                if (rlRejected instanceof RateLimiterRes) {
                                    return done(null, false, {
                                        statusCode: 429,
                                        retrySecs: Math.round(rlRejected.msBeforeNext / 1000) || 1
                                    })
                                } else {
                                    return done(rlRejected)
                                }
                            }
                        }
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
            // }
        ));

        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            User.findUserById({userId:id}).then((user, err) => {
                done(err, user);
            });
        });

        // res.json("note: hello");
    }
}