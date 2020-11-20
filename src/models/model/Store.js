const mongoose = require('mongoose')
const StoreSchema = require("../schema/Store");

const StoreModel= mongoose.model('Store', StoreSchema);

module.exports = {
    insert: function (newStore) {  
        const result = StoreModel.create(newStore);
        if(result)
            return result;
        else
            return {error:"Error with the creation Store"}; 
    },

    update: function (Store) {  
        const result = StoreModel.findByIdAndUpdate({_id: Store._id}, Store);
        if(result)
            return result;
        else
            return {error:"Error with the update Store"};
    },

    delete: function (Store) {  
        const result = StoreModel.findOneAndDelete({_id: Store._id}).then(()=> console.log("Deleted store")).catch(()=>console.log("Error with deleting store"));
        if(result)
            return result;
        else
            return {error:"Error with the deletion Store"}; 
    }
};