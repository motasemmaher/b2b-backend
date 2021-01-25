module.exports = {
    sendNotification(io, userId) {
        io.on("connection", socket => {
            socket.on("placeOrder", async function (userInfo) {
                carOwner.getCarOwnerByUserId(userInfo._id).populate('shoppingCart').then(owner => {
                    
                });
            });
        });
    }
}