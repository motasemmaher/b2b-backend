const mongoose = require('mongoose')
MenuSchema = require('../schema/Menu');

MenuModel = mongoose.model('Menu', MenuSchema);

module.exports =
{
    //value
    createMenu()
    {
        //{storeId:value.storeId}
        const result = MenuModel.create({});
        if(result)
            return result;
        else
            return {error:"Error with the creation Menu"};
        
    }
    ,
    linkMenu(value)
    {
        const result = MenuModel.findOneAndUpdate(
                                    {_id:value._id},
                                    {storeId:value.storeId},
                                    {"useFindAndModify":false}
                                ).then().catch();
        if(result)
            return result;
        else
            return {error:"Error with the linking Menu"};
    }
    ,
    addCategory(value)
    {
        const result = MenuModel.findOneAndUpdate(
            {storeId:value.storeId},
            {$push: {categories:value.category}},
            {"useFindAndModify":false}
        );
        if(result)
            return result;
        else
            return {error:"Error with the adding category to the menu"};
    }
    ,
    deleteMenu(value)
    {
        const result = MenuModel.findOneAndDelete({_id:value._id}).then().catch();
        if(result)
            return result;
        else
            return {error:"Error with the deletion Menu"};
    }
    ,
    deleteMenuByStoreId(value)
    {
        const result = MenuModel.findOneAndDelete({storeId: {$in:value.storeIds}}).then().catch(); 
        if(result)
            return result;
        else
            return {error:"Error with the deletion Menu by store id"};
    }
    ,
    updateMenu(value)
    {
        const result = MenuModel.findOneAndUpdate({storeId:value.storeId},
                                                  {categories:value.categories},
                                                  {"useFindAndModify":false}
            );
        if(result)
            return result;
        else
            return {error:"Error with the updating Menu"};
    }
    ,
    getCategoriesOfMenu(value)
    {
        const result = MenuModel.findOne({storeId:value.storeId});
        if(result)
            return result;
        else
            return {error:"Error with the getting category of a Menu"};
    }

    
}