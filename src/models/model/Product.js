const mongoose = require('mongoose')
ProductSchema = require('../schema/Product');

ProductModel = mongoose.model('Product', ProductSchema);

module.exports = {

    createProduct(value) {
        const result = ProductModel.create({
            name: value.name,
            price: value.price,
            image: value.image,
            categoryId: value.categoryId,
            productType: value.productType,
            description: value.description
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the creation Product"
            };
    },

    updateProduct(value) {
        const result = ProductModel.findOneAndUpdate({
            _id: value._id
        }, {
            name: value.name,
            price: value.price,
            image: value.image,
            categoryId: value.categoryId,
            productType: value.productType,
            description: value.description
        }, {
            "useFindAndModify": false
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the update Product"
            };
    },

    getProduct(value) {
        const result = ProductModel.findOne({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the update Product"
            };
    },

    deleteProduct(value) {
        const result = ProductModel.findOneAndDelete({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the deletion Product"
            };
    }

}