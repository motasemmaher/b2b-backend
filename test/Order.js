process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const ORDER = require('../src/business/Objects').ORDER;