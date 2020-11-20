const mongoose = require('mongoose')
const GarageOwnerSchema = require("../schema/GarageOwner");

const GarageOwnerModel= mongoose.model('GarageOwner', GarageOwnerSchema);

module.exports = {
    insert: function (newGarageOwner) 
    {  
        const result = GarageOwnerModel.create(newGarageOwner);
        if(result)
            return result;
        else
            return {error:"Error with the creation GarageOwner"}; 
    },

    update: function (GarageOwner) {  
        const result = GarageOwnerModel.findByIdAndUpdate({_id: GarageOwner._id}, GarageOwner);
        if(result)
            return result;
        else
            return {error:"Error with the update GarageOwner"}; 
    },

    delete: function (GarageOwner) {  
        const result = GarageOwnerModel.findOneAndDelete({_id: GarageOwner._id}).then(()=> console.log("Deleted garageOwner")).catch(()=>console.log("Error with deleting garageOwner"));
        if(result)
            return result;
        else
            return {error:"Error with the deletion GarageOwner"}; 
    }
};