const CategoryModel = require('../../models/model/Category');
const ProductModel = require('../../models/model/Product');
const CategoryValidation = require('./validate');

module.exports = class Category{

    constructor() {}
    
    validateCategoryInfo(categoryInfo)
    {
        const validationResult = CategoryValidation.validateCategoryInfo(categoryInfo);
        if(validationResult !== "pass")
            return {err:"Error: "+validationResult};
    }

    createCategory(categoryInfo)
    {
        const promiseResult = CategoryModel.createCategory(categoryInfo);
        return promiseResult;
    }

    getProductsOfCategory(categoryId)
    {
        const promiseResult = ProductModel.getAllProducts({categoryId:categoryId});
        return promiseResult;
    }

    updateCategory(categoryInfo)
    {
        const promiseResult = CategoryModel.updateCategory(categoryInfo);
        return promiseResult;
    }

    removeCategory(categoryId)
    {
        const promiseResult = CategoryModel.deleteCategory({_id:categoryId});
        return promiseResult;
    }

    addProduct(categoryId,product)
    {
        const promiseResult = CategoryModel.addProduct({_id:categoryId,product:product});
        return promiseResult;
    }

    findCategoryById(categoryId)
    {
        const promiseResult = CategoryModel.findCategoryById({_id:categoryId});
        return promiseResult;
    }

    deleteCategoriesByStoreIds(storeIds)
    {
        const promiseResult = CategoryModel.deleteCategoriesByStoreIds({storeIds:storeIds});
        return promiseResult;
    }

    getAllCategoriesInUserStores(storeIds)
    {
        const promiseResult = CategoryModel.findAllCategoriesInUserStores({storeIds:storeIds});
        return promiseResult;
    }

    findCategoryByName(categoryName)
    {
        const promiseResult = CategoryModel.findCategoryByName({name:categoryName});
        return promiseResult;
    }

    removeProductFromCategory(categoryId,productId)
    {
        const promiseResult = CategoryModel.removeProductFromCategory({categoryId:categoryId,productId:productId});
        return promiseResult;
    }

}