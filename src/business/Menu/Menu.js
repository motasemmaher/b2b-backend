//Requiring the necessary files and models
const MenuModel = require('../../models/model/Menu');
//Exporting the class
module.exports = class Menu{

    constructor() {}
    //A method to create menu
    createMenu()
    {
        const promiseResult = MenuModel.createMenu();
        return promiseResult;
    }
    //A method to delete menu from the database by using its ID
    deleteMenu(menuId)
    {
        const promiseResult = MenuModel.deleteMenu({_id:menuId});
        return promiseResult;
    }
    //A method to link menu to a store
    linkMenu(info)
    {
        const promiseResult = MenuModel.linkMenu(info);
        return promiseResult;
    }
    //A method to add a category to the menu
    addCategory(storeId,category)
    {
        const promiseResult = MenuModel.addCategory({storeId:storeId,category:category});
        return promiseResult;
    }
    //A method to update menu
    updateMenu(menu)
    {
        const promiseResult = MenuModel.updateMenu(menu);
        return promiseResult;
    }
    //A method to get all the categories of a menu
    getAllCategories(storeId)
    {
        const promiseResult = MenuModel.getCategoriesOfMenu({storeId:storeId});
        return promiseResult;
    }
    //A method to delete menu from the database by using the storeId
    deleteMenuByStoreId(storeIds)
    {
        const promiseResult = MenuModel.deleteMenuByStoreId({storeIds:storeIds});
        return promiseResult;
    }
    //FOR TESTING
    //A method to get menu by its ID
    getMenu(menuId)
    {
        const promiseResult = MenuModel.findMenu({_id:menuId});
        return promiseResult;
    }
}