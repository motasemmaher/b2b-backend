let io;

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer,
            {
                cors: {
                    origin: 'http://localhost:8100',
                    methods: "*",
                    optionsSuccessStatus: 200,
                    credentials: true
                }
            });
        return io
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket not initialized')
        }
        return io;
    }
}