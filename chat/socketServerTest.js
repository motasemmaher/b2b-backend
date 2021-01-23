const express = require("express");
const cors = require('cors');
const app = express();
const uri = 'mongodb://localhost:27017/GPTest';
const mongoose = require('mongoose');
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })

const corsOptions = {
    origin: 'http://localhost:8100',
    methods: "*",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

console.log('runServerChat...')
// console.log(appServer)
const server = require('http').createServer(app);
const io = require('socket.io')(3001);

io.attach(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

io.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100/");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

io.path('/user/chat')
io.on('connection', (socket) => {
    userForChat.forEach(Element => {
        socket.on(Element, (message) => {
            chat.pushMessage(Element, message).then(result => {
                socket.broadcast.emit(Element, message);
            }).catch(err => {
                if (err) {
                    console.log(err)
                    res.status(400).send({
                        error: err
                    });
                }
            });
        });
    });
});

app.listen(3001, () => console.log('Listen on port 3001, http://localhost:3001'))