const mongoose = require('mongoose')
const CarSchema = require("../schema/Car");

const CarModel= mongoose.model('Car', CarSchema);

module.exports = 
{

    exists(value)
    {
        const result = CarModel.exists({_id:value.carId},{id:1});
        if(result)
            return result;
        else
        return {error:"Error with the getting Car"};  
    },
    createCar(value)
    {
        const result = CarModel.create({userId:value.userId,model:value.model,make:value.make,year:value.year});

        if(result)
            return result;
        else
            return {error:"Error with the creation Car"};  
    }
    ,
    updateCar(value)
    {

        const result = CarModel.findOneAndUpdate(
                        {_id:value._id},
                        value,
                         {"useFindAndModify":false}
                    );
     
           if(result)
                return result;
            else
                return {error:"Error with the update Car"};  
        
    }
    ,
    deleteCar(value)
    {
        const result = CarModel.findOneAndDelete({_id:value._id}).then().catch();
        if(result)
            return result;
        else
        return {error:"Error with the delete Car"};  
    }
    ,
    findCar(value)
    {
        const result = CarModel.findById({_id:value._id});
        if(result)
            return result;
        else
        return {error:"Error with the getting Car"};  
    }
    ,
    deleteAllCars()
    {
        const result = CarModel.deleteMany({});
        if(result)
        return result;
        else
        return {error:"Error with the delete all Cars"};  
    }

}