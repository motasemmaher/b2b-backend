//Requiring the necessary files and models
const ProductModel = require('../../models/model/Product');
const ProductValidation = require('./validate');
//Exporting the class
module.exports = class Product {

    constructor() {}
    //A method to check if the product exists in the database by using its ID
    exists(productId) {
        const promiseResult = ProductModel.exists({productId});
        return promiseResult;
    }
    //A method to get the count of all the products stored in the database
    countAll(type)
    {
        const promiseResult = ProductModel.countAllProducts({type});
        return promiseResult;
    }
    //A method to get the count of the products of a specific store
    countByStore(storeId,type)
    {
        const promiseResult = ProductModel.countByStore({storeId,type});
        return promiseResult;
    }
    //A method to get the count of the products of a specific category
    countByCategory(categoryId,type)
    {
        const promiseResult = ProductModel.countByCategory({categoryId,type});
        return promiseResult;
    }
    //A method to get the count of all products with offers
    countByOffers() {
        const promiseResult = ProductModel.countByOffers();
        return promiseResult;
    }
    //A method to get the count of the products with offers of a specific store
    countByOffersOfStore(storeId) {
        const promiseResult = ProductModel.countByOffersOfStore({storeId});
        return promiseResult;
    }
    //A method to validate the product information
    validateProductInfo(productInfo) {
        const validationResult = ProductValidation.validateProductInfo(productInfo);
        if (validationResult !== "pass")
            return {
                error: "Error: " + validationResult
            };
    }
    //A method to create a product
    createProduct(productInfo) {
        const promiseResult = ProductModel.createProduct(productInfo);
        return promiseResult;
    }
    //A method to update a product
    updateProduct(updatedProduct) {
        const promiseResult = ProductModel.updateProduct(updatedProduct);
        return promiseResult;
    }
    //A method to delete a product from teh databse by its ID
    deleteProduct(productId)
    {
        const promiseResult = ProductModel.deleteProduct({_id:productId});
        return promiseResult;
    }
    //A method to delete the products of a category
    deleteProductsOfCategory(categoryId)
    {
        const promiseResult = ProductModel.deleteProducts(categoryId);
        return promiseResult;
    }    
    //A method to get a product from the database by using its ID
    getProductById(productId) {
        const promiseResult = ProductModel.findProductById({productId});
        return promiseResult;
    }
    //A method to get products of a category
    getProductsOfCategory(categoryId,type,limit,skip,nameSort,priceSort)
    {
        const promiseResult = ProductModel.findProductsOfCategory({categoryId,type,skip,limit,nameSort,priceSort});
        return promiseResult;
    }
    //A method to get products of a list of categories
    deleteProductsOfCategoriesId(categoriesIds)
    {
        const promiseResult = ProductModel.deleteProductsOfCategoriesId({categoriesIds});
        return promiseResult;
    }
    //A method to add an offer to a product
    addOffer(productId, offer) {
        const promiseResult = ProductModel.addOffer({productId,offer});
        return promiseResult;
    }
    //A method to remove an offer to a product
    removeOffer(offerId) {
        const promiseResult = ProductModel.removeOffer({offerId});
        return promiseResult;
    }
    //A method to get all the products with offers
    getProductsWithOffers(limit, skip) {
        const promiseResult = ProductModel.findProductsWithOffers({limit,skip});
        return promiseResult;
    }
    //A method to get  the products with offers of a specific store
    getProductsWithOffersOfStore(storeId, limit, skip) {
        const promiseResult = ProductModel.findProductsWithOffersByStore({storeId,limit,skip});
        return promiseResult;
    }
    //A method to get all the products stored in the database (unless a type is specified)
    getAllProducts(type,limit,skip,nameSort,priceSort)
    {
        const promiseResult = ProductModel.findAllProducts({type,limit,skip,nameSort,priceSort});
        return promiseResult;
    }
    //A method to get all the products of a store (unless a type is specified)
    getProductsOfStore(storeId,type,limit,skip,nameSort,priceSort)
    {
        const promiseResult = ProductModel.findProductsOfStore({storeId,type,limit,skip,nameSort,priceSort});
        return promiseResult;
    }
    //A method to get teh products with expired offers
    expiredOffers() {
        const promiseResult = ProductModel.expiredOffers();
        return promiseResult;
    }
    // added by thaer
    //A method to search through the products
    searchProducts(searchText, limit, skip) {
        const result = ProductModel.searchProducts({searchText,limit,skip});
        return result;
    }
    //A method to get a product and its offer by using ID
    findProductAndItsOffer(ProductId) {
        const result = ProductModel.findProductAndItsOffer({_id: ProductId});
        return result;
    }
    //A method to update the product stock
    updateProductStock(updatedProductStock)
    {        
        const result = ProductModel.updateProductStock(updatedProductStock);                
        return result;
    } 
}