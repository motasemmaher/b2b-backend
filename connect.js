const mongoose = require('mongoose');
const uri = "mongodb+srv://admin:admin@cluster0.n4bjd.mongodb.net/GP?retryWrites=true&w=majority";
const testuri = "mongodb+srv://admin:admin@cluster0.n4bjd.mongodb.net/GPTest?retryWrites=true&w=majority";

function connect() {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'test') 
    {
        mongoose.connect(testuri,{ useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true})
        .then((res, err) => {
            console.log("connected to testdb")
            if (err) return reject(err);
            resolve();
        })
        .catch(err => console.log("Error connecting to testdb"));    
    }
    else 
    {
        mongoose.connect(uri,{ useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true})
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