const ProductModel = require('../../models/model/Product')
const Product = require('../Product/Product')

module.exports = class Service extends Product
{
    constructor (productInfo)
    {
        const promiseResult = ProductModel.createProduct(productInfo);
        promiseResult.then(result => console.log("Created Service \n"+result));
    }
}