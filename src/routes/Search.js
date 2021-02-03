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
router.get('/search', (req, res) => {
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip); skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    const search = req.query.search;
    if (search) {
        const regex = new RegExp(escapeRegex(search), 'gi');
        store.searchStores(regex, limit, skip).then(storesSearchResult => {
            product.searchProducts(regex, limit, skip).then(productsSearchResult => {
                return res.send({
                    productsSearchResult, storesSearchResult
                });
            }).catch(err => {
                return res.status(404).send({
                    error: "ERROR_IN_SEARCH"
                });
            });
        }).catch(err => {
            return res.status(404).send({ error: "ERROR_IN_SEARCH" });
        });
    }
    else {
        return res.status(400).send({
            error: 'ERROR_YOU_MUST_SPECIFY_WHERE_YOU_WANT_TO_SEARCH_IN_STORES_OR_PRODUCTS'
        });
    }
});

module.exports = router;