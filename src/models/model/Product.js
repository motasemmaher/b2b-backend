const mongoose = require('mongoose')
ProductSchema = require('../schema/Product');

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports =
{
    createProduct(value)
    {
        //{name:value.name,price:value.price,image:value.image,categoryId:value.categoryId,productType:value.productType,description:value.description}
        const result = ProductModel.create(value);
        if(result)
            return result;
        else
            return {error:"Error with the creation Product"};
    }
    ,
    updateProduct(value)
    {
        const result = ProductModel.findOneAndUpdate(
                {_id:value._id},
                {name:value.name,price:value.price,image:value.image,categoryId:value.categoryId,productType:value.productType,description:value.description}, {"useFindAndModify":false}
                );
        if(result)
            return result;
        else
            return {error:"Error with the update Product"};
    }
    ,
    deleteProduct(value)
    {
        const result = ProductModel.findOneAndDelete({_id:value._id});
        if(result)
            return result;
        else
            return {error:"Error with the deletion Product"};
    }
    ,
    deleteProducts(value)
    {
        const result = ProductModel.deleteMany({categoryId:value});
        if(result)
            return result;
        else
            return {error:"Error with the deletion Products"};
    }
    ,
    getProduct(value)
    {
        const result = ProductModel.find({categoryId:value.cateoryId});
        if(result)
            return result;
        else
            return {error:"Error with the getting the  Product"};
    }
    ,
    getAllProducts(value)
    {
        const result = ProductModel.find({categoryId:value.categoryId});
        if(result)
            return result;
        else
            return {error:"Error with the getting all Products inside a category"};
    },

    // added by thaer
    searchProducts(value) {
        const result = ProductModel.find({
            $or: [{
                    name: value.searchText
                },
                {
                    description: value.searchText
                }
            ]
        },
        {
            name: 1,
            price: 1,
            image: 1,
            productType: 1,
            description: 1
        })
        .limit(value.limit)
        .skip(value.skip);

        if (result)
            return result;
        else
            return {
                error: "Error in searchProducts function"
            };
    }
}