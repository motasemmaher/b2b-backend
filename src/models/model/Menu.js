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
    deleteMenu(value)
    {
        const result = MenuModel.findOneAndDelete({_id:value._id}).then(()=> console.log("Deleted menu")).catch(()=>console.log("Error with deleting menu"));
        if(result)
            return result;
        else
            return {error:"Error with the deletion Menu"};
    }
    
}