const ProductModel = require('../../models/model/Product');
const ProductValidation = require('./validate');

module.exports = class Product {

    constructor() {}

    exists(productId) {
        const promiseResult = ProductModel.exists({
            productId: productId
        });
        return promiseResult;
    }

    countAll(type)
    {
        const promiseResult = ProductModel.countAllProducts({type});
        return promiseResult;
    }

    countByStore(storeId,type)
    {
        const promiseResult = ProductModel.countByStore({storeId,type});
        return promiseResult;
    }

    countByCategory(categoryId,type)
    {
        const promiseResult = ProductModel.countByCategory({categoryId,type});
        return promiseResult;
    }

    countByOffers() {
        const promiseResult = ProductModel.countByOffers();
        return promiseResult;
    }

    countByOffersOfStore(storeId) {
        const promiseResult = ProductModel.countByOffersOfStore({
            storeId: storeId
        });
        return promiseResult;
    }

    validateProductInfo(productInfo) {
        const validationResult = ProductValidation.validateProductInfo(productInfo);
        if (validationResult !== "pass")
            return {
                err: "Error: " + validationResult
            };
    }

    createProduct(productInfo) {
        const promiseResult = ProductModel.createProduct(productInfo);
        return promiseResult;
    }

    updateProduct(updatedProduct) {
        const promiseResult = ProductModel.updateProduct(updatedProduct);
        return promiseResult;
    }

    deleteProduct(productId)
    {
        const promiseResult = ProductModel.deleteProduct({_id:productId});
        return promiseResult;
    }
    
    deleteProductsOfCategory(categoryId)
    {
        const promiseResult = ProductModel.deleteProducts(categoryId);
        return promiseResult;
    }    

    getProductById(productId) {
        const promiseResult = ProductModel.findProductById({
            productId: productId
        });
        return promiseResult;
    }

    /*
    getProductsOfCategory(categoryId) {
        const promiseResult = ProductModel.findProductsOfCategory({
            categoryId: categoryId
        });
        return promiseResult;
    }
    */
    getProductsOfCategory(categoryId,type,limit,skip,nameSort,priceSort)
    {
        const promiseResult = ProductModel.findProductsOfCategory({categoryId,type,skip,limit,nameSort,priceSort});
        return promiseResult;
    }

    deleteProductsOfCategoriesId(categoriesIds)
    {
        const promiseResult = ProductModel.deleteProductsOfCategoriesId({categoriesIds:categoriesIds});
        return promiseResult;
    }

    addOffer(productId, offer) {
        const promiseResult = ProductModel.addOffer({
            productId: productId,
            offer: offer
        });
        return promiseResult;
    }

    removeOffer(offerId) {
        const promiseResult = ProductModel.removeOffer({
            offerId: offerId
        });
        return promiseResult;
    }

    getProductsWithOffers(limit, skip) {
        const promiseResult = ProductModel.findProductsWithOffers({
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }

    getProductsWithOffersOfStore(storeId, limit, skip) {
        const promiseResult = ProductModel.findProductsWithOffersByStore({
            storeId: storeId,
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }

    /*
    getAllProducts(limit, skip, nameSort, priceSort) {
        const promiseResult = ProductModel.findAllProducts({
            limit: limit,
            skip: skip,
            nameSort: nameSort,
            priceSort: priceSort
        });
        return promiseResult;
    }
    */

    getAllProducts(type,limit,skip,nameSort,priceSort)
    {
        const promiseResult = ProductModel.findAllProducts({type,limit,skip,nameSort,priceSort});
        return promiseResult;
    }

    getProductsOfStore(storeId,type,limit,skip,nameSort,priceSort)
    {
        const promiseResult = ProductModel.findProductsOfStore({storeId,type,limit,skip,nameSort,priceSort});
        return promiseResult;
    }

    expiredOffers() {
        const promiseResult = ProductModel.expiredOffers();
        return promiseResult;
    }

    // added by thaer
    searchProducts(searchText, limit, skip) {
        const result = ProductModel.searchProducts({
            searchText: searchText,
            limit: limit,
            skip: skip
        });
        return result;
    }

    findProductAndItsOffer(ProductId) {
        const result = ProductModel.findProductAndItsOffer({
            _id: ProductId
        });
        return result;
    }
}