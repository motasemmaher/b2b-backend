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

setProductType = function(productType)
{
    let type;
    if(productType === "all")
        type = ["Part","Accessory","Service"];
    else if (productType === "Part")
        type = "Part";
    else if (productType === "Accessory")
        type = "Accessory";
    else if (productType === "Service")
        type = "Service";
    return type;
};

module.exports =
{
    exists(value)
    {
        const result = ProductModel.exists({_id:value.productId},{id:1});
        if(result)
            return result;
        else
            return {
                error: "Error with the getting the  Product by uid."
            };
    },

    createProduct(value) {
        //{name:value.name,price:value.price,image:value.image,categoryId:value.categoryId,productType:value.productType,description:value.description}
        tags = value.tags.split(',');
        value = {
            ...value,
            tags: tags
        };
        const result = ProductModel.create(value);
        if (result)
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
        const result = ProductModel.findById({_id:value.productId});
        if(result)
            return result;
        else
            return {error:"Error with the getting the  Product by uid."};
    },
    findProductsOfCategory(value)
    {
        const nameSort = value.nameSort;
        const priceSort = value.priceSort;
        const limit = value.limit;
        const skip = value.skip;
        const type = setProductType(value.type);
        let result;

        if(nameSort == 0 && priceSort == 0)
            result = ProductModel.find({categoryId:value.categoryId,productType:{$in:type}})
                                 .skip(skip).limit(limit)
                                 .select('name price image description');
        else if (nameSort == 0 && priceSort != 0)
            result = ProductModel.find({categoryId:value.categoryId,productType:{$in:type}})
                                 .skip(skip).limit(limit)
                                 .sort({price:priceSort})
                                 .select('name price image description');
        else if (nameSort != 0 && priceSort == 0)
            result = ProductModel.find({categoryId:value.categoryId,productType:{$in:type}})
                                 .skip(skip).limit(limit)                     
                                 .sort({name:nameSort})
                                 .select('name price image description');
        else if (nameSort != 0 && priceSort != 0)
            result = ProductModel.find({categoryId:value.categoryId,productType:{$in:type}})
                                 .skip(skip).limit(limit)
                                 .sort({name:nameSort,price:priceSort})
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
        const result = ProductModel.find({offer: { $ne: null } })
                                   .skip(value.skip).limit(value.limit)
                                   .populate("offer");
        
        if(result)
            return result;
        else
            return {
                error: "Error with the getting all Products with offers"
            };
    },
    findProductsWithOffersByStore(value)
    {
        const result = ProductModel.find({ storeId:value.storeId,offer: { $ne: null } })
                                   .skip(value.skip).limit(value.limit)
                                   .populate("offer");
        
        if(result)
            return result;
        else
            return {
                error: "Error with the getting products with offers of a store"
            };
    },
    addOffer(value) {
        const result = ProductModel.findByIdAndUpdate({
            _id: value.productId
        }, {
            offer: value.offer
        }, {
            "useFindAndModify": false
        });

        if (result)
            return result;
        else
            return {
                error: "Error with adding an offer to the product"
            };
    },
    removeOffer(value) {
        const result = ProductModel.findOneAndUpdate({
            offer: {
                _id: value.offerId
            }
        }, {
            offer: null
        }, {
            "useFindAndModify": false
        });

        if (result)
            return result;
        else
            return {
                error: "Error with removing an offer to the product"
            };
    },
    expiredOffers() {
        today = addDays(0);
        const result = ProductModel.where("offer").ne(null).populate({
            "path": "offer",
            "match": {
                expirationDate: {
                    $lt: today
                }
            }
        });

        if (result)
            return result;
        else
            return {error:"Error with getting expired offers"};
    }
    ,
    findAllProducts(value)
    {
        const nameSort = value.nameSort;
        const priceSort = value.priceSort;
        const limit = value.limit;
        const skip = value.skip;
        const type = setProductType(value.type);
        let result;

        if(nameSort == 0 && priceSort == 0)
            result = ProductModel.find({productType: {$in:type}})
                                 .skip(skip).limit(limit)
                                 .populate('offer')
                                 .select('name price image offer description');                                     
        else if (nameSort == 0 && priceSort != 0)
            result = ProductModel.find({productType: {$in:type}})
                                 .skip(skip).limit(limit)
                                 .sort({price:priceSort})
                                 .populate('offer')
                                 .select('name price image offer description');                                     
        else if (nameSort != 0 && priceSort == 0)
            result = ProductModel.find({productType: {$in:type}})
                                 .skip(skip).limit(limit)
                                 .sort({name:nameSort})
                                 .populate('offer')
                                 .select('name price image offer description');                                     
        else if (nameSort != 0 && priceSort != 0)
            result = ProductModel.find({productType: {$in:type}})
                                 .skip(skip).limit(limit)
                                 .sort({name:nameSort,price:priceSort})
                                 .populate('offer')
                                 .select('name price image offer description');                                     
        
        if(result)
            return result;
        else
            return {error:"Error with getting all products"};
    }
    ,
    findProductsOfStore(value)
    {
        const nameSort = value.nameSort;
        const priceSort = value.priceSort;
        const limit = value.limit;
        const skip = value.skip;
        const from = value.type
        const type = setProductType(value.type);
        let result;

        if(nameSort == 0 && priceSort == 0)
            result = ProductModel.find({storeId:value.storeId,productType: {$in:type}})
                                 .skip(skip).limit(limit)
                                 .populate('offer')
                                 .select('name price image offer description');                                     
        else if (nameSort == 0 && priceSort != 0)
            //result = ProductModel.find({storeId:value.storeId})
            result = ProductModel.find({storeId:value.storeId,productType: {$in:type}})
                                 .skip(skip).limit(limit)
                                 .sort({price:priceSort})
                                 .populate('offer')
                                 .select('name price image offer description');                                     
        else if (nameSort != 0 && priceSort == 0)
            result = ProductModel.find({storeId:value.storeId,productType: {$in:type}})
                                 .skip(skip).limit(limit)
                                 .sort({name:nameSort})
                                 .populate('offer')
                                 .select('name price image offer description');    
        else if (nameSort != 0 && priceSort != 0)
            result = ProductModel.find({storeId:value.storeId,productType: {$in:type}})
                                 .skip(skip).limit(limit)
                                 .sort({name:nameSort,price:priceSort})
                                 .populate('offer')
                                 .select('name price image offer description');                                     
        
        if(result)
            return result;
        else
            return {error:"Error with getting products of the store"};
    }
    ,
    countByStore(value)
    {
        type = setProductType(value.type);
        const count = ProductModel.countDocuments({storeId: value.storeId,productType:{$in:type}});
        return count;
    }
    ,
    countByCategory(value)
    {
        type = setProductType(value.type);
        const count = ProductModel.countDocuments({categoryId: value.categoryId,productType:{$in:type}});
        return count;
    },
    countByOffers(value) {
        const count = ProductModel.countDocuments({
            offer: {
                $ne: null
            }
        });
        return count;
    },
    countByOffersOfStore(value) {
        const count = ProductModel.countDocuments({
            storeId: value.storeId,
            offer: {
                $ne: null
            }
        });
        return count;
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
            }, {
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
    },

    findProductAndItsOffer(value) {
        const result = ProductModel.findOne({
            _id: value._id
        })
        .populate('offer');
        if (result)
            return result;
        else
            return {
                error: "Error in findProductAndItsOffer function"
            };
    },
    
    countAllProducts(value)
    {
        type = setProductType(value.type);
        const count = ProductModel.countDocuments({productType:{$in:type}});
        return count;
    }
}