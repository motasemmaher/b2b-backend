const mongoose = require('mongoose')
const CarOwnerSchema = require("../schema/CarOwner");

const CarOwnerModel= mongoose.model('CarOwner', CarOwnerSchema);


module.exports = {
    insert: function (newCarOwner) {  
        const result = CarOwnerModel.create(newCarOwner);
        if(result)
            return result;
        else
            return {error:"Error with the creation CarOwner"}; 

    },

    update: function (CarOwner) {  
        const result = CarOwnerModel.findByIdAndUpdate({_id: CarOwner._id}, CarOwner);
        if(result)
            return result;
        else
            return {error:"Error with the update CarOwner"}; 
    },

    delete: function (CarOwner) {  
        const result = CarOwnerModel.findOneAndDelete({_id: CarOwner._id}).then(()=> console.log("Deleted carOwner")).catch(()=>console.log("Error with deleting carOwner"));
        if(result)
            return result;
        else
            return {error:"Error with the deletion CarOwner"}; 
    }
};