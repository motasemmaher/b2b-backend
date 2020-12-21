const jwt = require('jsonwebtoken');
module.exports = {
    userAuthenticated: function (req, res, next) {
    //    if (req.isAuthenticated()) {
            try {
                const token = req.headers.authorization.split(' ')[0];   
                // console.log(token); 
                // console.log(req.headers);          
                if (!token) return res.status(401).send({
                    'error-message': 'invalid login, please login.'
                })
                // console.log(process.env.token_pass);
                const verified = jwt.verify(token, process.env.token_pass, {
                    expiresIn: '1h'
                })
                console.log(verified); 
                req.user = verified;
                
                return next();
            } catch (err) {
                return res.status(400).send({
                    error: err
                })
            }


           //return next();
    //    }

    //    res.redirect('user/login');

    }
};