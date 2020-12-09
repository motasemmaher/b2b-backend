const ProductModel = require('../../models/model/Product');
const ProductValidation = require('./validate');

module.exports = class Product{ 

    constructor () {}

    validateProductInfo(productInfo)
    {
        const validationResult = ProductValidation.validateProductInfo(productInfo);
        if(validationResult !== "pass")
            return {err:"Error: "+validationResult};
    }

    createProduct(productInfo)
    {
        const promiseResult = ProductModel.createProduct(productInfo);
        return promiseResult;
    }

    updateProduct(updatedProduct)
    {
        const promiseResult = ProductModel.updateProduct(updatedProduct);
        return promiseResult;
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

    removeProductsOfCategoriesId(categoriesIds)
    {
        console.log("Inside roduct class: "+categoriesIds);
        const promiseResult = ProductModel.deleteProductsOfCategoriesId({categoriesIds:categoriesIds});
        return promiseResult;
    }

    getProductById(productId)
    {
        const promiseResult = ProductModel.findProductById({productId:productId});
        return promiseResult;
    }

    getProduct(categoryId)
    {
        const promiseResult = ProductModel.getProduct({categoryId:categoryId});
        return promiseResult;
    }

    addOffer(productId,offer)
    {
        const promiseResult = ProductModel.addOffer({productId:productId,offer:offer});
        return promiseResult;
    }

    removeOffer(offerId)
    {
        const promiseResult = ProductModel.removeOffer({offerId:offerId});
        return promiseResult;
    }

    getProductsWithOffers(categoryId)
    {
        const promiseResult = ProductModel.findProductsWithOffers({categoryId:categoryId});
        return promiseResult;
    }

    expiredOffers()
    {
        const promiseResult = ProductModel.expiredOffers();
        return promiseResult;
    }

}