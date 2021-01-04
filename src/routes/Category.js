const express = require('express');
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');

const category = require('../business/Objects').CATEGORY;
const store = require('../business/Objects').STORE;
const menu = require('../business/Objects').MENU;

//----------View Categories of a store and View a Category----------
router.get('/stores/:storeId/categories/:categoryId?',(req,res) => {
    storeId = req.params.storeId;
    
    store.exists(storeId)
    .then(storeResult => {
    if(storeResult == null)
        res.status(404).send({error:"Error! Didn't find a store with thats id."});
    else
    {
        if(req.params.categoryId == null)
        {
            //Getting the categories list from that menu
            menu.getAllCategories(storeId).populate('categories','name')
            .then(categoriesResult => res.status(200).send({count:categoriesResult.categories.length,categories:categoriesResult.categories}))
            .catch(err => res.status(500).send({error:"Error getting categories of the requested store. "+err}));
        }
        else
        {
            category.findCategoryById(req.params.categoryId).populate('products')
            .then(categoryResult => {
            if(categoryResult == null)
                res.status(404).send({error:"Error! Didn't find a category with that id."});
            else
                res.status(200).send(categoryResult)
            })
            .catch(err => res.status(500).send({error:"Error getting the requested category. "+err}));
        }
    }
    })
    .catch(err => res.status(500).send({error:"Error getting the store. "+err}));
});
//----------Create Category----------
router.post('/stores/:storeId/create-category',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;

    if(loggedUser.role !== "garageOwner")
        res.status(401).send("Unauthorized user");
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.status(404).send({error:"Error! Didn't find a store with that id."})
        else if(getStoreResult.userId != loggedUser._id)
            res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            categoryInfo = {...req.body};
            const categoryValidationResult = category.validateCategoryInfo(categoryInfo);
            if(typeof categoryValidationResult !== 'undefined')
                res.status(400).send(categoryValidationResult.err);
            else
            {
                //Checking if there is a category with the provided name
                category.findCategoryByName(categoryInfo.name)
                .then(categoryFindResult =>{
                // If there aren't any categories with that name inside the store, begin the creating process
                if (categoryFindResult == null || categoryFindResult.storeId != storeId)
                {
                    //1- Creating category with the provided information
                    category.createCategory({...categoryInfo,storeId:storeId})
                    .then(categoryCreateResult => {
                    //2- Adding a ref for the new category to the store's menu
                    menu.addCategory(storeId,categoryCreateResult)
                        .then(menuResult => {
                            res.status(200).send(categoryCreateResult);
                        })
                        .catch(err => {
                        category.deleteCategory(categoryCreateResult._id);
                        res.status(500).send({error:"Error updating menu.  "+err});
                        });
                    })  
                    .catch(err => res.status(500).send({error:"Error creating category.  "+err}));
                }
                // Else it will a return a response that it already exists
                else 
                res.status(400).send("A category with that name already exists");
                })
                .catch(err => res.status(500).send({error:"Error getting category Name.   "+err}));
            }
        }
        })
        .catch(err => res.status(500).send({error:"Error getting store id. "+err}));
    }
});
//----------Update Category----------
router.put('/stores/:storeId/update-category/:categoryId',userAuthenticated,(req,res) => {  
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    categoryInfo = {...req.body};

    if(loggedUser.role !== "garageOwner")
        res.status(401).send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.status(404).send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.status(404).send({error:"Error! Didn't find a cateory with that id."})
            else
            {
                const validationResult = category.validateCategoryInfo(categoryInfo);
                if(typeof validationResult !== 'undefined')
                    res.status(400).send(validationResult.err);
                else
                {
                    //Checking if there is a category with the name that the user provided in the update information
                    category.findCategoryByName(categoryInfo.name)
                    .then(categoryFindResult =>{
                    // If there aren't any categories with that name inside the store, begin the updating process
                    if (categoryFindResult == null || categoryFindResult.storeId != storeId)
                    { 
                        //1- Update the category with the ID with the new provided information
                        category.updateCategory({_id:categoryId,...categoryInfo})
                        .then(categoryUpdateResult =>{
                        //2- After the update finishes, find the updated category by its ID then return it to the user
                        category.findCategoryById(categoryId)
                            .then(categoryFindResult => {
                                res.status(200).send(categoryFindResult);
                            })
                            .catch(err => res.status(500).send({error:"Error finding category.  "+err}))
                        })
                        .catch(err => res.status(500).send({error:"Error updating category.  "+err}));
                    }
                    // Else it will a return a response that it already exists
                    else    
                        res.status(400).send("A category with that name already exists.");
                    })
                    .catch(err => res.status(500).send({error:"Error getting category name.    "+err}))
                }
            }
            })
            .catch(err => res.status(500).send({error:"Error getting category id.  "+err}));
        }
        })
        .catch(err => res.status(500).send({error:"Error getting store id.  "+err}));
    }
});
//----------Delete Category----------
router.delete('/stores/:storeId/delete-category/:categoryId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "garageOwner")
        res.status(401).send("Unauthorized user")
    else
    {
        storeId = req.params.storeId;
        categoryId = req.params.categoryId;

        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.status(404).send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.status(404).send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.status(404).send({error:"Error! Didn't find a cateory with that id."})
            else
            {
                //Startting the process of deleting the category
                //1- Getting all the categories from the store's menu
                menu.getAllCategories(storeId)
                .then(menuResult => {
                //2- Updating the categories list inside the store's list 
                const index = menuResult.categories.indexOf(categoryId);
                menuResult.categories.splice(index,1);
                menu.updateMenu({storeId:menuResult.storeId,categories:menuResult.categories})
                    .then(updateMenuResult =>{
                    //3- Removing the category    
                    category.deleteCategory(categoryId)
                        .then(categoryResult =>{
                        //4- Removing the products inside that category    
                        product.deleteProductsOfCategory(categoryId)
                            .then(productsResult =>{
                            //5- Removing the products from the warehouse
                            warehouse.removeProductsFromWarehouse(storeId,categoryId)
                                .then(warehouseResult => {
                                    res.status(200).send({success:true});
                                })
                                .catch(err => res.status(500).send({error:"Error removing products from warehouse.  "+err}));
                            })  
                            .catch(err => res.status(500).send({error:"Error removing products of the category.  "+err}))
                        })
                        .catch(err => res.status(500).send({error:"Error deleting category.  "+err}));
                    })
                    .catch(err => res.status(500).send({error:"Error removing category from the menu.  "+err}));
                })
                .catch(err => res.status(500).send({error:"Error getting the categories of the menu.  "+err}));
            }
        })
        .catch(err => res.status(500).send({error:"Error getting the category id.  "+err}));
        }
        })
        .catch(err => res.status(500).send({error:"Error getting the store id.  "+err}));
    }
});

module.exports = router;