//Requiring the necessay files, middlewares and packages
const express = require('express');
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');
//Requiring the necessary objects
const category = require('../business/Objects').CATEGORY;
const store = require('../business/Objects').STORE;
const menu = require('../business/Objects').MENU;
const product = require('../business/Objects').PRODUCT;
const warehouse = require('../business/Objects').WAREHOUSE;

//----------View Categories of a store and View a Category----------
router.get('/stores/:storeId/categories/:categoryId?',(req,res) => {
    //Checking if the store exists
    storeId = req.params.storeId;
    store.exists(storeId)
    .then(storeResult => {
    //If it doesn't, restun error response
    if(!storeResult)
        return res.status(404).send({error:"Error! Didn't find a store with thats id."});
    //Checking if categoryId in the url exists
    //If it doesn't, retunr all categories of store
    if(req.params.categoryId == null)
    {
        //Getting the categories list from that menu
        menu.getAllCategories(storeId).populate('categories','name')
        .then(categoriesResult => {
            //Return successful response
            return res.status(200).send({count:categoriesResult.categories.length,categories:categoriesResult.categories})
        })
        //If getting categories runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error getting categories of the requested store. "+err})});
    }
    //If categoryId was provided
    else
    {
        //Getting category with taht id
        category.findCategoryById(req.params.categoryId).populate('products')
        .then(categoryResult => {
        //Cheking if a category with that id exists
        //If it doesn't exist, return error response
        if(categoryResult == null)
            return res.status(404).send({error:"Error! Didn't find a category with that id."});
        //If it exists, return successful response
        else
            return res.status(200).send(categoryResult)
        })
        //If getting cate4gory runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error getting the requested category. "+err})});
    }
    })
    //If getting store runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error getting the store. "+err})});
});
//----------Create Category----------
router.post('/stores/:storeId/create-category',userAuthenticated,(req,res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response
    loggedUser = req.user;
    if(loggedUser.role !== "garageOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    //Checking if the request body id empty or not, if it is then return error response
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    //Checking if the provided storeId exists
    storeId = req.params.storeId;
    store.exists(storeId)
    .then(getStoreResult => {
    //If it doesn't exist, return error response
    if(!getStoreResult)
        return res.status(404).send({error:"Error! Didn't find a store with that id."})
    //If the provided storeId doesn't belong to the logged user, return error response
    else if(getStoreResult.userId != loggedUser._id)
        return res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
    //If it exists and belongs to the logged user, thenn proceed
    else
    {
        //Storing tehn validating the provided data from the request body
        categoryInfo = {...req.body};
        const categoryValidationResult = category.validateCategoryInfo(categoryInfo);
        //If error was fiound, return error response
        if(typeof categoryValidationResult !== 'undefined')
            return res.status(400).send({error:categoryValidationResult.error});
        
        //Checking if there is a category with the provided name
        category.findCategoryByName(categoryInfo.name)
        .then(categoryFindResult =>{
        // If there aren't any categories with that name inside the store, begin the creating process
        if (categoryFindResult == null || categoryFindResult.storeId != storeId)
        {
            //Creating category with the provided information
            category.createCategory({...categoryInfo,storeId:storeId})
            .then(categoryCreateResult => {
            //Adding a ref for the new category to the store's menu
            menu.addCategory(storeId,categoryCreateResult)
                .then(menuResult => {
                //Return successful response
                return res.status(200).send(categoryCreateResult);
                })
                //If updating menu runs into error, return error response
                .catch(err => {
                category.deleteCategory(categoryCreateResult._id);
                return res.status(500).send({error:"Error updating menu.  "+err});
                });
            })  
            //If creating category runs into error, return error response
            .catch(err => {return res.status(500).send({error:"Error creating category.  "+err})});
        }
        // Else it will a return a response that it already exists
        else 
            return res.status(400).send({error:"A category with that name already exists"});
        })
        //If gettingt category by name runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error getting category Name.   "+err})});
    }
    })
    //If getting store by id runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error getting store id. "+err})});
});
//----------Update Category----------
router.put('/stores/:storeId/update-category/:categoryId',userAuthenticated,(req,res) => {  
    //Getting and checking if the logged user is an authorized one, if not then return error response
    loggedUser = req.user;
    if(loggedUser.role !== "garageOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    //Checking if the request body id empty or not, if it is then return error response
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    //Checking if the provided storeId exists
    storeId = req.params.storeId;
    store.exists(storeId)
    .then(getStoreResult => {
    //If it doesn't exist, return error response
    if(!getStoreResult)
        return res.status(404).send({error:"Error! Didn't find a store with that id."});
    //If the provided storeId doesn't belong to the logged user, return error response
    else if(getStoreResult.userId != loggedUser._id)
        return res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
    //If it exists and belongs to the logged user, thenn proceed
    else
    {
        //Checking if the category exists by it's ID
        categoryId = req.params.categoryId;    
        category.exists(categoryId)
        .then(getCategoryResult => {
        //If the category doesn't exist, return error response
        if(!getCategoryResult)
            return res.status(404).send({error:"Error! Didn't find a cateory with that id."})
        //Storing tehn validating the provided data from the request body
        categoryInfo = {...req.body};
        const categoryValidationResult = category.validateCategoryInfo(categoryInfo);
        if(typeof categoryValidationResult !== 'undefined')
            return res.status(400).send({error:categoryValidationResult.error});
        else
        {
            //Checking if there is a category with the name that the user provided in the update information
            category.findCategoryByName(categoryInfo.name)
            .then(categoryFindResult =>{
            // If there aren't any categories with that name inside the store, begin the updating process
            if (categoryFindResult == null || categoryFindResult.storeId != storeId)
            { 
                //Update the category with the ID with the new provided information
                category.updateCategory({_id:categoryId,...categoryInfo})
                .then(categoryUpdateResult =>{
                //After the update finishes, find the updated category by its ID then return it to the user
                category.findCategoryById(categoryId)
                    .then(categoryFindResult => {
                        //Returning successful response
                        return res.status(200).send(categoryFindResult);
                    })
                    //If getting category runs into error, return error response
                    .catch(err => {return res.status(500).send({error:"Error finding category.  "+err})});
                })
                //If updating category runs into error, return error response
                .catch(err => {return res.status(500).send({error:"Error updating category.  "+err})});
            }
            // Else it will a return a response that it already exists
            else    
                return res.status(400).send({error:"A category with that name already exists."});
            })
            //If getting category by name runs into error, return error response
            .catch(err => {return res.status(500).send({error:"Error getting category name.    "+err})});
        }
        })
        //If getting category by id runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error getting category id.  "+err})});
    }
    })
    //If getting store by id runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error getting store id.  "+err})});   
});
//----------Delete Category----------
router.delete('/stores/:storeId/delete-category/:categoryId',userAuthenticated,(req,res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response
    loggedUser = req.user;
    if(loggedUser.role !== "garageOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    //Checking if the provided storeId exists
    storeId = req.params.storeId;
    store.exists(storeId)
    .then(getStoreResult => {
    //If it doesn't exist, return error response
    if(!getStoreResult)
        return res.status(404).send({error:"Error! Didn't find a store with that id."});
    //If the provided storeId doesn't belong to the logged user, return error response
    else if(getStoreResult.userId != loggedUser._id)
        return res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
    //If it exists and belongs to the logged user, thenn proceed
    else
    {
        //Checking if the category exists by it's ID
        categoryId = req.params.categoryId;
        category.exists(categoryId)
        .then(getCategoryResult => {
        //If the category doesn't exist, return error response
        if(!getCategoryResult)
            return res.status(404).send({error:"Error! Didn't find a cateory with that id."});
        //Startting the process of deleting the category
        //Getting all the categories from the store's menu
        menu.getAllCategories(storeId)
        .then(menuResult => {
        //Updating the categories list inside the store's list 
        const index = menuResult.categories.indexOf(categoryId);
        menuResult.categories.splice(index,1);
        menu.updateMenu({storeId:menuResult.storeId,categories:menuResult.categories})
            .then(updateMenuResult =>{
            //Removing the category    
            category.deleteCategory(categoryId)
                .then(categoryResult =>{
                //Removing the products inside that category    
                product.deleteProductsOfCategory(categoryId)
                    .then(productsResult =>{
                    //Removing the products from the warehouse
                    warehouse.removeProductsFromWarehouse(storeId,categoryId)
                        .then(warehouseResult => {
                            //Returning successsful response
                            return res.status(200).send({success:true});
                        })
                        //If removing the products of warehouse runs into error, return error response
                        .catch(err => {return res.status(500).send({error:"Error removing products from warehouse.  "+err})});
                    })  
                    //If removing the products of category runs into error, return error response
                    .catch(err => {return res.status(500).send({error:"Error removing products of the category.  "+err})});
                })
                //If deleting category runs into error, return error response
                .catch(err => {return res.status(500).send({error:"Error deleting category. "+err})});
            })
            //If removing category from menu runs into error, return error response
            .catch(err => {return res.status(500).send({error:"Error removing category from the menu.  "+err})});
        })
        //If getting categories of menu runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error getting the categories of the menu.  "+err})});
    })
    //If getting category by id runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error getting the category id.  "+err})});
    }
    })
    //If getting store by id runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error getting the store id.  "+err})});
    
});
//Exporting route
module.exports = router;