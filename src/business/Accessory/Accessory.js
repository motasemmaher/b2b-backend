const ProductModel = require('../../models/model/Product')
const Product = require('../Product/Product')

module.exports = class Accessory extends Product
{
    constructor (productInfo)
    {
        const promiseResult = ProductModel.createProduct(productInfo);
        promiseResult.then(result => console.log("Created Accessory \n"+result));
    }
}