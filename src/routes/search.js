const express = require('express');
const router = express.Router();

//Requiring classes
const product = require('../business/Objects').PRODUCT;
const store = require('../business/Objects').STORE;

// validation by thaer
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//---------------------search in (stores or products)---------------------\\
router.get('/', (req, res) => {
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);

    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    const search = req.query.search;
    const fliter = req.query.fliter;

    if (search) {
        const regex = new RegExp(escapeRegex(search), 'gi');
        if (fliter === 'stores') {
            store.searchStores(regex, limit, skip).then(storesSearchResult => {
                if (storesSearchResult.length <= 0) {
                    return res.status(404).send({
                        Error: 'There is no result'
                    });
                }
                return res.send({
                    storesSearchResult
                });
            }).catch(err => {
                res.status(404).send("Error in search");
            });
        } else if (fliter === 'products') {
            product.searchProducts(regex, limit, skip).then(productsSearchResult => {
                if (productsSearchResult.length <= 0) {
                    return res.status(404).send({
                        Error: 'There is no result'
                    });
                }
                return res.send({
                    productsSearchResult
                });
            }).catch(err => {
                res.status(404).send("Error in search");
            });
        } else {
            return res.status(400).send({
                Error: 'you must specify where you want to search in (stores or products)'
            });
        }

    } else {
        res.status(404).send({
            Error: 'There is no result'
        });
    }
});

module.exports = router;