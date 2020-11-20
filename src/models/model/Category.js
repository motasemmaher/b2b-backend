const mongoose = require('mongoose')
const CategorySchema = require("../schema/Category");

CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = 
{

    createCategory(value)
    {
        const result = CategoryModel.create({name:value.name,image:value.image,storeId:value.storeId});
        if(result)
        return result;
        else
        return {error:"Error with the creation Category"};  
    }
    ,
    updateCategory(value)
    {
        const result = CategoryModel.findOneAndUpdate(
                {_id:value._id},
                {name:value.name,image:value.image,storeId:value.storeId}, {"useFindAndModify":false}
                );
        if(result)
            return result;
        else
            return {error:"Error with the update Category"};  
    }
    ,
    deleteCategory(value)
    {
        const result = CategoryModel.findOneAndDelete({_id:value._id});
        if(result)
            return result;
        else
            return {error:"Error with the deletion Category"};  
    }
    ,
    getCategoryInfo(value)
    {
        const result = CategoryModel.findById({_id:value._id});
        if(result)
            return result;
        else
            return {error:"Error with the getting Category information"};  
    }

}