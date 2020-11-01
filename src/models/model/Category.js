const mongoose = require('mongoose')
const CategorySchema = require("../schema/Category");
CategoryMode = mongoose.model('Category', CategorySchema);

module.exports = class Category
{
    static createCategory(res,value)
    {
        console.log(value);
        CategoryModel.create({name:value.name,image:value.image,storeId:value.storeId})
                     .then(result => res.send("Created Category"))
                     .catch(err => res.send("Error with the creation Category"));
    }

    static updateCategory(res,value)
    {
        CategoryModel.findOneAndUpdate(
                {_id:value._id},
                {name:value.name,image:value.image,storeId:value.storeId}, {"useFindAndModify":false}
                )
                .then(result => res.send("Updated Category"))
                .catch(err => res.send("Error with the update Category"));
    }

    static deleteCategory(res,value)
    {
        CategoryModel.findOneAndDelete({_id:value._id})
                     .then(result => res.send("Deleted Category"))
                     .catch(err => res.send("Error with the deletion Category"));
    }

    static getCategoryInfo(res,value)
    {
        CategoryModel.findById({_id:value._id})
                     .then(result => res.send(result))
                     .catch(err => res.send("Error with the getting Category"));
    }

}