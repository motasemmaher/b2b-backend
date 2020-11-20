const ProductModel = require('../../models/model/Product')

module.exports = class Product{ 

    /*
    constructor ()
    {
        const promiseResult = ProductModel.createProduct(productInfo);
        promiseResult.then(result => console.log("Created Product \n"+result));
    }
    */

    
    constructor (productInfo)
    {}

    createProduct(productInfo)
    {
        const promiseResult = ProductModel.createProduct(productInfo);
        return promiseResult;
    }

    updateProduct(updatedProduct)
    {
        const promiseResult = ProductModel.updateProduct(updatedProduct);
        promiseResult.then(result => console.log("Updated Product \n"+result));
    }

    removeProduct(productId)
    {
        const promiseResult = ProductModel.deleteProduct({_id:productId});
        return promiseResult;
    }
    
    removeProductsOfCategory(categoryId)
    {
        const promiseResult = ProductModel.deleteProducts(categoryId);
        return promiseResult;
    }

    getProduct(categoryId)
    {
        const promiseResult = ProductModel.getProduct({categoryId:categoryId});
        return promiseResult;
    }
}