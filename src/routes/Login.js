const express = require("express");
const router = express.Router();
const login = require('../auth/login');
const {
    userAuthenticated
} = require('../middleware/authentication');

// Login User 
router.get('/user/login', (req, res) => {
    res.json({
        state: 'Hello from login page'
    });
});

router.post('/user/login', (req, res, next) => {
    // The HTTP 429 Too Many Requests response status code indicates the user has sent too many 
    // requests in a given amount of time ("rate limiting").        
    // A Retry-After header might be included to this 
    //response indicating how long to wait before making a new request.
    const username = req.body.username;
    const password = req.body.password;
    // if(!username)
    if (!req.user) {
        login.login(req, username, password).then(loginInfo => {
            if (loginInfo.blockFor) {
                return res.send(loginInfo);
            }
            if (loginInfo.user !== null) {
                return res.status(200).send({
                    auth: true,
                    token: loginInfo.token,
                    user: {
                        _id: loginInfo.user._id,
                        username: loginInfo.user.username,
                        role: loginInfo.user.role
                    }
                });

            } else {
                return res.status(400).send({
                    error: 'Invalid username or password'
                });
            }

        });
    } else {
        res.send({
            msg: 'already logged in'
        });
    }
});

router.delete('/user/logout', userAuthenticated, (req, res) => {
    // console.log(req.session.token)
    // req.headers.authorization.split(' ')[0]
    req.session.token = null;
    res.send({ sucess: true })
    // res.redirect('/user/login');
});

module.exports = router;