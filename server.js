const app = require('./index.js');
const connection = require('./connect');
const Permissions = require('./src/business/Permissions/Permissions');
const permissions = new Permissions();
const PORT = 3000;
const chat = require('./src/business/Objects').CHAT;

let http = require('http');
let server = http.Server(app);

// let socketIO = require('socket.io');
// let io = socketIO(server, );
let {
    userForChat
} = require('./src/routes/Chat');
userForChat = userForChat;

const io = require('./socket').init(server);
io.on('connection', (socket) => {
    userForChat.forEach(Element => {
        socket.on(Element, (message) => {
            chat.pushMessage(Element, message).then(result => {
                socket.broadcast.emit(Element, message);
            }).catch(err => {
                if (err) {
                    // console.log(err)
                    res.status(400).send({
                        error: err
                    });
                }
            });
        });
    });
});

connection.connect()
    .then(() => {
        server.listen(PORT, () => {
           
            Promise.all([
                permissions.createPermissions('carOwner'),
                permissions.createPermissions('garageOwner'),
                permissions.createPermissions('admin'),
                permissions.createPermissions('waitingUser')
            ]).then(values => {

            }).catch(err => {

            });
            console.log(`Listening to server http://localhost:${PORT}`)
        });
    })
    .catch(() => console.log("Didn't open port"));

// zone-evergreen.js:2845 GET http://localhost:3000/socket.io/?EIO=3&transport=polling&t=NSliDjj 404 (Not Found)