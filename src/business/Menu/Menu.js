const MenuModel = require('../../models/model/Menu');


module.exports = class Menu{

    constructor(){

    }

    addCategory(storeId,category)
    {
        console.log("INSIDE ADD CATEGORY")
        const promiseResult = MenuModel.addCategory({storeId:storeId,category:category});
        return promiseResult;
    }

    updateMenu(menu)
    {
        const promiseResult = MenuModel.updateMenu(menu);
        return promiseResult;
    }

    getAllCategories(storeId)
    {
        const promiseResult = MenuModel.getCategoriesOfMenu({storeId:storeId});
        return promiseResult;
    }

}