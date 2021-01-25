const mongoose = require('mongoose');
// const uri = "mongodb+srv://admin:admin@cluster0.n4bjd.mongodb.net/GP?retryWrites=true&w=majority";
const testuri = "mongodb+srv://admin:admin@cluster0.n4bjd.mongodb.net/GPTest?retryWrites=true&w=majority";
const uri = 'mongodb://localhost:27017/GPTest';
//const testuri = 'mongodb://localhost:27017/GPTest';
//"test":"mocha --recursive --timeout 100000 --exit"
//"test": "nyc --reporter=text --timeout 100000 mocha --exit"
function connect() {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'test') 
    {
        mongoose.connect(testuri,{ useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true, useFindAndModify: false})
        .then((res, err) => {
            console.log("connected to testdb")
            require ('./src/models/model/Admin');
            require ('./src/models/model/Car');
            require ('./src/models/model/CarOwner');
            require ('./src/models/model/CartItem');
            require ('./src/models/model/Category');
            require ('./src/models/model/Complaint');
            require ('./src/models/model/Contact');
            require ('./src/models/model/GarageOwner');
            require ('./src/models/model/Menu');
            require ('./src/models/model/Message');
            require ('./src/models/model/Offer');
            require ('./src/models/model/Order');
            require ('./src/models/model/Product');
            require ('./src/models/model/ShoppingCart');
            require ('./src/models/model/Store');
            require ('./src/models/model/User');
            require ('./src/models/model/Warehouse');

            if (err) return reject(err);
            resolve();
        })
        .catch(err => console.log("Error connecting to testdb"));    
    }
    else 
    {
        mongoose.connect(uri,{ useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true, useFindAndModify: false})
        .then((res, err) => {
          console.log("connected to DB")
          if (err) return reject(err);
          resolve();
      })
      .catch(err => console.log("Error connecting to db"));    
    }
  });
}

function close()
{
  return mongoose.disconnect();
}

module.exports = { connect, close };