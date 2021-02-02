const app = require('./index.js');
const connection = require('./connect');
const Permissions = require('./src/business/Permissions/Permissions');
const permissions = new Permissions();
const PORT = 80;
connection.connect()
    .then(app.listen(80, () => {
        Promise.all([
            permissions.createPermissions('carOwner'),
            permissions.createPermissions('garageOwner'),
            permissions.createPermissions('admin'),
            permissions.createPermissions('waitingUser')
        ]).then(values => {
            
        }).catch(err => {
            
        });
        console.log(`Listening to server http://localhost:${80}`)
    }))
    .catch(() => console.log("Didn't open port"));