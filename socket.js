let io;

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer,
            {
                cors: {
                    origin: ['http://localhost:8100', 'http://localhost:8101', 'http://dev.makt-b2b.live/'],
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