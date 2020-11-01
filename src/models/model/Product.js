const mongoose = require('mongoose')
ProductSchema = require('../schema/Product');
ProductModel = mongoose.model('Product', ProductSchema);

module.exports = class Product
{

    static createProduct(res,value)
    {
        console.log(value);
        ProductModel.create(
                {name:value.name,price:value.price,image:value.image,categoryId:value.categoryId,productType:value.productType,description:value.description}
                )
                .then(result => res.send("Created Product"))
                .catch(err => res.send("Error with the creation Product"));
    }

    static updateProduct(res,value)
    {
        ProductModel.findOneAndUpdate(
                {_id:value._id},
                {name:value.name,price:value.price,image:value.image,categoryId:value.categoryId,productType:value.productType,description:value.description}, {"useFindAndModify":false}
                )
                .then(result => res.send("Updated Product"))
                .catch(err => res.send("Error with the update Product"));
    }

    static deleteProduct(res,value)
    {
        ProductModel.findOneAndDelete({_id:value._id})
                    .then(result => res.send("Deleted Product"))
                    .catch(err => res.send("Error with the deletion Product"));
    }

}