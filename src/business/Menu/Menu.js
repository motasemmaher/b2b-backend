const MenuModel = require('../../models/model/Menu');
module.exports = class Menu{

    constructor() {}

    createMenu()
    {
        const promiseResult = MenuModel.createMenu();
        return promiseResult;
    }

    deleteMenu(menuId)
    {
        const promiseResult = MenuModel.deleteMenu({_id:menuId});
        return promiseResult;
    }

    linkMenu(info)
    {
        const promiseResult = MenuModel.linkMenu(info);
        return promiseResult;
    }

    addCategory(storeId,category)
    {
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

    deleteMenuByStoreId(storeIds)
    {
        const promiseResult = MenuModel.deleteMenuByStoreId({storeIds:storeIds});
        return promiseResult;
    }

    //FOR TESTING
    getMenu(menuId)
    {
        const promiseResult = MenuModel.findMenu({_id:menuId});
        return promiseResult;
    }
}