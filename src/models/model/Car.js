const mongoose = require('mongoose')
const CarSchema = require("../schema/Car");
const CarModel= mongoose.model('Car', CarSchema);

module.exports = 
{
    createCar(res,value)
    {
        console.log("Inside create car");
        const result = CarModel.create({userId:value.userId,model:value.model,make:value.make,year:value.year});
        if(result)
            return result;
        else
            return {error:"Error with the creation Car"};
                
                /*
                .then(result => {

                    console.log(result); 
                    return result;
                })
                .catch(err => console.log("Error with the creation Car:\n"+err));   
                */
    }
    ,
    updateCar(res,value)
    {
        CarModel.findOneAndUpdate(
                {_id:value._id},
                {userId:value.userId,model:value.model,make:value.make,year:value.year}, {"useFindAndModify":false}
                )
                .then(result => res.send("Updated Car"))
                .catch(err => res.send("Error with the update Car"));
    }
    ,
    deleteCar(res,value)
    {
        CarModel.findOneAndDelete({_id:value._id})
                .then(result => res.send("Deleted Car"))
                .catch(err => res.send("Error with the deletion Car"));
    }
    ,
    deleteAllCars()
    {
        CarModel.deleteMany({})
                .then(result => console.log("Deleted All Cars"))
                .catch(err => console.log("Error with the deletion Cars"));;
    }
}