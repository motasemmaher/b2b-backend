const mongoose = require('mongoose')
ProductSchema = require('../schema/Product');
const moment = require('moment');
//const { addDays } = require('date-and-time');

const ProductModel = mongoose.model('Product', ProductSchema);

addDays = function(days)
     {
        let date = new Date();
        date.setDate(date.getDate() + days);
        return date;  
    };

module.exports =
{
    createProduct(value)
    {
        //{name:value.name,price:value.price,image:value.image,categoryId:value.categoryId,productType:value.productType,description:value.description}
        tags = value.tags.split(',');
        value = {...value,tags:tags};
        const result = ProductModel.create(value);
        if(result)
            return result;
        else
            return {error:"Error with the creation Product"};
    }
    ,
    updateProduct(value)
    {
        tags = value.tags.split(',');
        value = {...value,tags:tags};
        const result = ProductModel.findOneAndUpdate(
                {_id:value._id},
                value, 
                {"useFindAndModify":false}
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
    deleteProductsOfCategoriesId(value)
    {
        const result = ProductModel.deleteMany({categoryId:{$in:value.categoriesIds}});
        if(result)
            return result;
        else
            return {error:"Error with the deletion Products of these categories"};
    }
    ,
    findProductById(value)
    {
        const result = ProductModel.find({_id:value.productId});
        if(result)
            return result;
        else
            return {error:"Error with the getting the  Product by uid."};
    }
    ,
    getProduct(value)
    {
        const result = ProductModel.find({categoryId:value.categoryId});
        if(result)
            return result;
        else
            return {error:"Error with the getting the  Product"};
    }
    ,
    getAllProducts(value)
    {
        const result = ProductModel.find({categoryId:value.categoryId})
                                   .select('name price image description');
        if(result)
            return result;
        else
            return {error:"Error with the getting all Products inside a category"};
    }
    ,
    addOffer(value)
    {
        const result = ProductModel.findByIdAndUpdate({_id:value.productId},
                                                      {offer:value.offer},
                                                      {"useFindAndModify":false}
                                                    );
                                   
        if(result)
            return result;
        else
            return {error:"Error with adding an offer to the product"};
    }
    ,
    removeOffer(value)
    {
        const result = ProductModel.findOneAndUpdate({offer: {_id:value.offerId}},
                                                      {offer:null},
                                                      {"useFindAndModify":false}
                                                    );
                                   
        if(result)
            return result;
        else
            return {error:"Error with removing an offer to the product"};
    }
    ,
    findProductsWithOffers(value)
    {
        const result = ProductModel.find({ categoryId:value.categoryId,offer: { $ne: null } }).populate("offer");
        
        if(result)
            return result;
        else
            return {error:"Error with getting products with offers"};
    }
    ,
    expiredOffers()
    {
        today = addDays(0);
        const result = ProductModel.where("offer").ne(null).populate( { "path":"offer","match":{expirationDate:{$lt:today}}});
        
        if(result)
            return result;
        else
            return {error:"Error with getting expired offers"};
    }
}