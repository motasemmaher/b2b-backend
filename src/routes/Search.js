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
    let skip = req.query.skip || '0';
    let limit = req.query.limit || '/* 30 */';
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);

    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    const search = req.query.search;
    const filter = req.query.filter;
    if (search) {
        const regex = new RegExp(escapeRegex(search), 'gi');
        if (filter === 'stores') {
            store.searchStores(regex, limit, skip).then(storesSearchResult => {
                // if (storesSearchResult.length <= 0) {
                //     return res.status(404).send({
                //         error: 'There is no result'
                //     });
                // }
                return res.send({
                    storesSearchResult
                });
            }).catch(err => {
                res.status(404).send({error: "ERROR_IN_SEARCH"});
            });
        } else if (filter === 'products') {
            product.searchProducts(regex, limit, skip).then(productsSearchResult => {
                // if (productsSearchResult.length <= 0) {
                //     return res.status(404).send({
                //         error: 'There is no result'
                //     });
                // }
                return res.send({
                    productsSearchResult
                });
            }).catch(err => {
                res.status(404).send({error: "ERROR_IN_SEARCH"});
            });
        } else {
            return res.status(400).send({
                error: 'ERROR_YOU_MUST_SPECIFY_WHERE_YOU_WANT_TO_SEARCH_IN_STORES_OR_PRODUCTS'
            });
        }

    } else {
        res.status(404).send({
            error: 'ERROR_THERE_IS_NO_RESULT'
        });
    }
});

module.exports = router;