//Requiring the necessary files and models
const CategoryModel = require('../../models/model/Category');
const CategoryValidation = require('./validate');
//Exporting the class
module.exports = class Category{

    constructor() {}
    //A method to check if a category exists in the database by using its ID
    exists(categoryId)
    {
        const promiseResult = CategoryModel.exists({categoryId:categoryId});
        return promiseResult;
    }
    //A method to validate the information of the category
    validateCategoryInfo(categoryInfo)
    {
        const validationResult = CategoryValidation.validateCategoryInfo(categoryInfo);
        if(validationResult !== "pass")
            return {error:"Error: "+validationResult};
    }
    //A method to create a category
    createCategory(categoryInfo)
    {
        const promiseResult = CategoryModel.createCategory(categoryInfo);
        return promiseResult;
    }
   //A method to update a category
    updateCategory(categoryInfo)
    {
        const promiseResult = CategoryModel.updateCategory(categoryInfo);
        return promiseResult;
    }
    //A method to delete a category from the database by using its ID
    deleteCategory(categoryId)
    {
        const promiseResult = CategoryModel.removeCategory({_id:categoryId});
        return promiseResult;
    }
    //A method to add a product to the list of products of a category
    addProduct(categoryId,product)
    {
        const promiseResult = CategoryModel.addProduct({_id:categoryId,product:product});
        return promiseResult;
    }
    //A method to get a category by its ID
    findCategoryById(categoryId)
    {
        const promiseResult = CategoryModel.findCategoryById({_id:categoryId});
        return promiseResult;
    }
    //A method to delete the categories associated with a list of stores
    deleteCategoriesByStoreIds(storeIds)
    {
        const promiseResult = CategoryModel.deleteCategoriesByStoreIds({storeIds:storeIds});
        return promiseResult;
    }
    //A method to delete the categories associated with thje stores of a garageOwner
    getAllCategoriesInUserStores(storeIds)
    {
        const promiseResult = CategoryModel.findAllCategoriesInUserStores({storeIds:storeIds});
        return promiseResult;
    }
    //A method to get a category by its name
    findCategoryByName(categoryName)
    {
        const promiseResult = CategoryModel.findCategoryByName({name:categoryName});
        return promiseResult;
    }
    //A method to remove a product to the list of products of a category
    removeProductFromCategory(categoryId,productId)
    {
        const promiseResult = CategoryModel.removeProductFromCategory({categoryId:categoryId,productId:productId});
        return promiseResult;
    }
    //A method to search through the categories in the database
    searchCategories(searchText) 
    {
        const result = CategoryModel.searchCategories({
            searchText: searchText
        });
        return result;
    }
}