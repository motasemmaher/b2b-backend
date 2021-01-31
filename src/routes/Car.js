//Requiring the necessary file,middlewares and packages
const express = require("express");
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');
//Requiring the necessary objects
const car = require('../business/Objects').CAR;
const carOwner = require('../business/Objects').CAROWNER;

//----------View Car Owner's cars----------
router.get('/user/manage-car-owner/cars/:carId?',userAuthenticated,(req, res) => {
    //Getting the logged user and validating if he is authorized, if not then return error response
    loggedUser = req.user;
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    //Checking if the carId in the url is null or not
    //If null, then get all the cars
    if(req.params.carId == null)
    {
        //Getting the cars of the logged carowner
        carOwner.getCarOwnerByUserId(loggedUser._id).populate('cars').exec()
        .then(carOwnerResult => {
            //Returning successful response
            return res.status(200).send(carOwnerResult.cars);
        })
        //If getting the cars runs into error, return error rseponse
        .catch(err => {return res.status(500).send({error:"Error with getting car owners. "+err})});
    }
    //If carId was given, then ge the car with that ID
    else
    {
        //Getting car
        car.getCar(req.params.carId)
        .then(carResult => {
            if(carResult == null)
                //If the car doesn't exist, return error response
                return res.status(404).send({error:"Didn't find a car with that id."});
            else
                //If the car exists, return succes response
                return res.status(200).send(carResult);
            })
            //If getting the car runs into error, return error rseponse
            .catch(err => {return res.status(500).send({error:"Error with getting car by id. "+err})});
    }
});
//----------Add Car----------
router.post('/user/manage-car-owner/add-car',userAuthenticated,(req, res) => {
    //Getting the logged user and validating if he is authorized, if not then return error response
    const loggedUser = req.user;
    //Checking if the request body is empty, then return error response
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    //Storing data from the body
    const carInfo = req.body;
    //Validating the stored data
    const carValidationResult = car.validateCarInfo(carInfo);
    //If error was found, return error response
    if(typeof carValidationResult !== 'undefined')
        return res.status(400).send({error:carValidationResult.error});
    //Create Car
    car.createCar(carInfo)
    .then(carResult => {
    //Get CarOwner
    carOwner.getCarOwnerByUserId(loggedUser._id)
        .then(carOwnerResult => {
        //Add car to the car list of the carOwner
        carOwner.addCarToList(carOwnerResult._id,carResult) 
            .then(addResult => {
                //Returing successful response
                return res.status(201).send(addResult);
            })
            //If adding the car to the list runs into error, return error response
            .catch(err =>{
            car.deleteCar(carResult._id);
            return res.status(500).send("Error with adding car to the CarOwner list: "+err);
            });
        })
        //If getting the carOwner runs into error, return error response
        .catch(err => {
        car.deleteCar(carResult._id);
        return res.status(500).send("Error with getting the CarOwner: "+err);
        });  
    })
    //If creating the car to the list runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error with creating car: "+err})});
});
//----------Update Car----------
router.put('/user/manage-car-owner/update-car/:carId',userAuthenticated,(req, res) => {
    //Getting the logged user and validating if he is authorized, if not then return error response
    const loggedUser = req.user;
    //Checking if the request body is empty, then return error response
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    //Checking if a car with that id exists
    const carId = req.params.carId;
    car.exists(carId)
    .then(getCarResult => {
    //If it doesn't exist, return error response
    if(!getCarResult)
        return res.status(404).send({error:"Error! Didn't find a car with that id."})
    //Getting carOwner by userId
    carOwner.getCarOwnerByUserId(loggedUser._id)
        .then(carOwnerResult => {
        //Checking if the car actually belongs to the current logged user
        //If it doesn't, return error response
        if(!carOwnerResult.cars.includes(carId))
            return res.status(401).send({error:"The requested car doesn't belong to this carowner."});
        //Storing data from body and validating it
        carInfo = {_id:carId,...req.body};    
        const carValidationResult = car.validateCarInfo(carInfo);
        //If error was found, return error response
        if(typeof carValidationResult !== 'undefined')
            return res.status(400).send({error:carValidationResult.error});
        //Updating car
        car.updateCar(carInfo)
            .then(carResult => {
            //Getting car
            car.getCar(carResult._id)
                .then(updatedCar => {
                //Returning successful response
                return res.status(200).send(updatedCar);
                })
                //If getting car runs into error, return error response
                .catch(err => {return res.status(500).send({error:"Error with getting Car. "+err})});
            })
            //If updating car runs into error, return error response
            .catch(err => {return res.status(500).send({error:"Error with updating Car. "+err})});
        })
        //If getting carOwner runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error with getting the car owner from the user id.    "+err})});
    })
    //If getting car runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error with getting car with that id. "+err})});
});
//----------Delete Car----------
router.delete('/user/manage-car-owner/delete-car/:carId',userAuthenticated,(req, res) => {
    //Getting the logged user and validating if he is authorized, if not then return error response
    const loggedUser = req.user;
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    //Checking if a car with that id exists
    const carId = req.params.carId;
    car.exists(carId)
    .then(getCarResult => {
    //If it doesn't exist, return error response
    if(!getCarResult)
        return res.status(404).send({error:"Error! Didn't find a car with that id."})
    //Getting carOwner by userId
    carOwner.getCarOwnerByUserId(loggedUser._id)
        .then(carOwnerResult => {
        //Checking if the car actually belongs to the current logged user
        //If it doesn't, return error response
        if(!carOwnerResult.cars.includes(carId))
            return res.status(401).send({error:"The requested car doesn't belong to this carowner."});
        //Deleting car
        car.deleteCar(carId)
            .then(carResult => {
            //Removing car from the carOwner's car list
            carOwner.removeCarFromList(carOwnerResult._id,carId)
                .then(removeResult => {
                //Returning successfull response
                return res.status(200).send({success:true});
                })
                //If removing car from list runs into error, return error response
                .catch(err => {return res.status(500).send({error:"Error removing car from the carOwner. "+err})});
            })
            //If getting carOwner runs into error, return error response
            .catch(err => {return res.status(500).send({error:"Error deleting car. "+err})});
        })
        //If deleting car runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error getting the carOwner. "+err})});    
    })
    //If checking the car existence runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error with checking if the car exists. "+err})});
});
//Exporting the route
module.exports = router;