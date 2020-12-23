const app = require('./index.js');
const connection = require('./connect');
const Permissions = require('./src/business/Perminssions/Perminssions');
const permissions = new Permissions();
const PORT = 3000;
connection.connect()
    .then(app.listen(PORT, () => {
        Promise.all([
            permissions.createPermissions('carOwner'),
            permissions.createPermissions('garageOwner'),
            permissions.createPermissions('admin'),
            permissions.createPermissions('waitingUser')
        ]).then(values => {
            console.log(values);
        }).catch(err => {
            console.log('already exists');
        });
        console.log(`Listening to server http://localhost:${PORT}`)
    }))
    .catch(() => console.log("Didn't open port"));