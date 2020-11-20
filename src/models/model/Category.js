const mongoose = require('mongoose')
const CategorySchema = require("../schema/Category");
ProductModel = require('../model/Product');

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
                {name:value.name,image:value.image},
                {"useFindAndModify":false}
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
    addProduct(value)
    {
        const result = CategoryModel.findOneAndUpdate(
                                    {_id:value._id},
                                    {$push:{products:value.product}},
                                    {"useFindAndModify":false}
                                );
        if(result)
            return result;
        else
            return {error:"Error with the adding product to the Category"};  
    }
    ,
    removeProductFromCategory(value)
    {
        console.log("pid: "+value.productId)
        console.log("cid: "+value.categoryId)

        const result = CategoryModel.update({_id:value.categoryId},
                                            { $pull: { products:value.productId } },
                                            { multi: true },
                                            );
        if(result)
            return result;
        else
            return {error:"Error with the removing product from category"};
    }
    ,
    findCategoryById(value)
    {
        const result = CategoryModel.findById({_id:value._id});
        if(result)
            return result;
        else
            return {error:"Error with the getting Category information by id"};  
    }
    ,
    findCategoryByName(value)
    {
        const result = CategoryModel.find({name:value.name});
        if(result)
            return result;
        else
            return {error:"Error with the finding Category information by name"};  
    }
}