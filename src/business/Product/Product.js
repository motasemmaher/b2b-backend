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

    countAll() {
        const promiseResult = ProductModel.countAllProducts();
        return promiseResult;
    }

    countByStore(storeId) {
        const promiseResult = ProductModel.countByStore({
            storeId: storeId
        });
        return promiseResult;
    }

    countByCategory(categoryId) {
        const promiseResult = ProductModel.countByCategory({
            categoryId: categoryId
        });
        return promiseResult;
    }

    countByOffers(storeId) {
        const promiseResult = ProductModel.countByOffers({
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

    removeProduct(productId) {
        const promiseResult = ProductModel.deleteProduct({
            _id: productId
        });
        return promiseResult;
    }

    removeProductsOfCategory(categoryId) {
        const promiseResult = ProductModel.deleteProducts(categoryId);
        return promiseResult;
    }

    removeProductsOfCategoriesId(categoriesIds) {
        console.log("Inside roduct class: " + categoriesIds);
        const promiseResult = ProductModel.deleteProductsOfCategoriesId({
            categoriesIds: categoriesIds
        });
        return promiseResult;
    }

    getProductById(productId) {
        const promiseResult = ProductModel.findProductById({
            productId: productId
        });
        return promiseResult;
    }

    getProduct(categoryId) {
        const promiseResult = ProductModel.getProduct({
            categoryId: categoryId
        });
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

    getProductsWithOffers(storeId, limit, skip) {
        const promiseResult = ProductModel.findProductsWithOffers({
            storeId: storeId,
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }

    getProductsWithOffers(storeId, limit, skip) {
        const promiseResult = ProductModel.findProductsWithOffers({
            storeId: storeId,
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }

    getAllProducts(limit, skip, nameSort, priceSort) {
        const promiseResult = ProductModel.findAllProducts({
            limit: limit,
            skip: skip,
            nameSort: nameSort,
            priceSort: priceSort
        });
        return promiseResult;
    }

    getProductsOfStore(storeId, limit, skip, nameSort, priceSort) {
        const promiseResult = ProductModel.findProductsOfStore({
            storeId: storeId,
            limit: limit,
            skip: skip,
            nameSort: nameSort,
            priceSort: priceSort
        });
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