const app = require('./index.js');
const connection = require('./connect');
const Permissions = require('./src/business/Permissions/Permissions');
const permissions = new Permissions();
const PORT = 3000;
const chat = require('./src/business/Objects').CHAT;
const { placeOrder } = require('./src/routes/ShoppingCart');
const http = require('http');

let server = http.Server(app);

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
        server.listen(process.env.PORT || PORT, () => {

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

