//Requiring packages
const express = require("express");
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');

const car = require('../business/Objects').CAR;
const carOwner = require('../business/Objects').CAROWNER;

//----------View Car Owner's cars----------
router.get('/user/manage-car-owner/cars/:carId?',userAuthenticated,(req, res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});

    if(req.params.carId == null)
    {
        carOwner.getCarOwnerByUserId(loggedUser._id).populate('cars').exec()
        .then(carOwnerResult => {
            return res.status(200).send(carOwnerResult.cars);
        })
        .catch(err => {return res.status(500).send({error:"Error with getting car owners. "+err})});
    }
    else
    {
        car.getCar(req.params.carId)
        .then(carResult => {
            if(carResult == null)
                return res.status(404).send({error:"Didn't find a car with that id."});
            else
                return res.status(200).send(carResult);
            })
            .catch(err => {return res.status(500).send({error:"Error with getting car by id. "+err})});
    }
});
//----------Add Car----------
router.post('/user/manage-car-owner/add-car',userAuthenticated,(req, res) => {
    const loggedUser = req.user;
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});
   
    const carInfo = req.body;
    const carValidationResult = car.validateCarInfo(carInfo);
    if(typeof carValidationResult !== 'undefined')
        return res.status(400).send({error:carValidationResult.error});
   
    car.createCar(carInfo)
    .then(carResult => {
    carOwner.getCarOwnerByUserId(loggedUser._id)
        .then(carOwnerResult => {
        carOwner.addCarToList(carOwnerResult._id,carResult) 
            .then(addResult => {
                return res.status(201).send(addResult);
            })
            .catch(err =>{
            car.deleteCar(carResult._id);
            return res.status(500).send("Error with adding car to the CarOwner list: "+err);
            });
        })
        .catch(err => {
        car.deleteCar(carResult._id);
        return res.status(500).send("Error with getting the CarOwner: "+err);
        });  
    })
    .catch(err => {return res.status(500).send({error:"Error with creating car: "+err})});
});
//----------Update Car----------
router.put('/user/manage-car-owner/update-car/:carId',userAuthenticated,(req, res) => {
    const loggedUser = req.user;
    const carId = req.params.carId;

    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    
    car.exists(carId)
    .then(getCarResult => {
    if(!getCarResult)
        return res.status(404).send({error:"Error! Didn't find a car with that id."})
    carOwner.getCarOwnerByUserId(loggedUser._id)
        .then(carOwnerResult => {
        if(!carOwnerResult.cars.includes(carId))
            return res.status(401).send({error:"The requested car doesn't belong to this carowner."});
        carInfo = {_id:carId,...req.body};    
        const carValidationResult = car.validateCarInfo(carInfo);
        if(typeof carValidationResult !== 'undefined')
            return res.status(400).send({error:carValidationResult.error});
        car.updateCar(carInfo)
            .then(carResult => {
            car.getCar(carResult._id)
                .then(updatedCar => {
                return res.status(200).send(updatedCar);
                })
                .catch(err => {return res.status(500).send({error:"Error with getting Car. "+err})});
            })
            .catch(err => {return res.status(500).send({error:"Error with updating Car. "+err})});
        })
        .catch(err => {return res.status(500).send({error:"Error with getting the car owner from the user id.    "+err})});
    })
    .catch(err => {return res.status(500).send({error:"Error with getting car with that id. "+err})});
});
//----------Delete Car----------
router.delete('/user/manage-car-owner/delete-car/:carId',userAuthenticated,(req, res) => {
    const loggedUser = req.user;
    const carId = req.params.carId;

    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    
    car.exists(carId)
    .then(getCarResult => {
    if(!getCarResult)
        return res.status(404).send({error:"Error! Didn't find a car with that id."})

    carOwner.getCarOwnerByUserId(loggedUser._id)
        .then(carOwnerResult => {
        if(!carOwnerResult.cars.includes(carId))
            return res.status(401).send({error:"The requested car doesn't belong to this carowner."});

        car.deleteCar(carId)
            .then(carResult => {
            carOwner.getCarOwnerByUserId(loggedUser._id)
                .then(carOwnerResult => {
                carOwner.removeCarFromList(carOwnerResult._id,carId)
                    .then(removeResult => {
                    return res.status(200).send({success:true});
                    })
                    .catch(err => {return res.status(500).send({error:"Error removing car from the carOwner. "+err})});
                })
                .catch(err => {return res.status(500).send({error:"Error getting carOwner. "+err})});
            })
            .catch(err => {return res.status(500).send({error:"Error deleting the car. "+err})});    
        })
        .catch(err => {return res.status(500).send({error:"Error with getting the car owner from the user id.   "+err})});
    })
    .catch(err => {return res.status(500).send({error:"Error with getting car with that id. "+err})});
});

module.exports = router;