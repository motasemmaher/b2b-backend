const app = require('./index.js');
const connection = require('./connect');

const PORT = 3000;

connection.connect()
          .then(app.listen(PORT,()=>{console.log(`Listening to server http://localhost:${PORT}`)}))
          .catch(()=>console.log("Didn't open port"));