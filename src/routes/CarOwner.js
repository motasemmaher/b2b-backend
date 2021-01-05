const express = require('express');
const router = express.Router();

const {
    userAuthenticated
} = require('../middleware/authentication');

//Requiring classes
const carOwner = require('../business/Objects').CAROWNER;
const order = require('../business/Objects').ORDER;

const limitAndSkipValidation = require('../shared/limitAndSkipValidation');



module.exports = router;