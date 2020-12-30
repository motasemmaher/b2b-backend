const mongoose = require('mongoose')
const CategorySchema = require("../schema/Category");
ProductModel = require('../model/Product');

const CategoryModel = mongoose.model('Category', CategorySchema);


module.exports =
{
    exists(value)
    {
        const result = CategoryModel.exists({_id: value.categoryId},{id:1});
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Category by id"
            };
    },
    createCategory(value) {
        // tags = value.tags.split(',');
        value = {
            ...value,
            // tags: tags
        };
        const result = CategoryModel.create(value);
        if (result)
            return result;
        else
            return {
                error: "Error with the creation Category"
            };
    },
    updateCategory(value) {
        if(!Array.isArray(value.tags)) {
            tags = value.tags.split(',');
            value = {
                ...value,
                tags: tags
            };
        }
        const result = CategoryModel.findOneAndUpdate({
                _id: value._id
            },
            value, {
                "useFindAndModify": false
            }
        );
        if (result)
            return result;
        else
            return { error: "Error with the update Category" };
    }
    ,
    removeCategory(value) {
        const result = CategoryModel.findOneAndDelete({ _id: value._id });
        if (result)
            return result;
        else
            return {
                error: "Error with the deletion Category"
            };
    },
    deleteCategoriesByStoreIds(value) {
        const result = CategoryModel.deleteMany({
            storeId: {
                $in: value.storeIds
            }
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the deletion Categories of the store"
            };
    },
    getCategoryInfo(value) {
        const result = CategoryModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Category information"
            };
    },
    addProduct(value) {
        const result = CategoryModel.findOneAndUpdate({
            _id: value._id
        }, {
            $push: {
                products: value.product
            }
        }, {
            "useFindAndModify": false
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the adding product to the Category"
            };
    },
    removeProductFromCategory(value) {
        //const result = CategoryModel.update({ _id: value.categoryId },
        const result = CategoryModel.findOneAndUpdate({
            _id: value.categoryId
        }, {
            $pull: {
                products: value.productId
            }
        }, {
            multi: true
        }, );
        if (result)
            return result;
        else
            return {
                error: "Error with the removing product from category"
            };
    },
    findCategoryById(value) {
        const result = CategoryModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Category information by id"
            };
    },
    findCategoryByName(value) {
        const result = CategoryModel.findOne({
            name: value.name
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the finding Category information by name"
            };
    },
    
    findAllCategoriesInUserStores(value) {
        const result = CategoryModel.find({
            storeId: {
                $in: value.storeIds
            }
        }, {
            id: 1
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the finding Categories for that user's stores"
            };
    },

    // added by thaer
    searchCategories(value) {
        const result = CategoryModel.find({
            name: value.searchText
        }, {
            name: 1,
            image: 1
        });

        if (result)
            return result;
        else
            return {
                error: "Error in searchCategories function"
            };
    }
}