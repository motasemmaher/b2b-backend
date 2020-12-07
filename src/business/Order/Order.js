const OrderModel = require('../../models/model/Order');

module.exports =  class Order {
    constructor (Order)
    {}

    createOrder(OrderInfo)
    {
        const promiseResult = OrderModel.createOrder(OrderInfo);
        return promiseResult;
    }

    updateOrder(updatedOrder)
    {
        const promiseResult = OrderModel.updateOrder(updatedOrder);       
        return promiseResult;
    }

    deleteOrder(orderId) 
    {
        const promiseResult = OrderModel.deleteOrder({_id: orderId});       
        return promiseResult;
    }

    removeOrder(OrderId)
    {
        const promiseResult = OrderModel.deleteOrder({_id: OrderId});
        return promiseResult;
    }

    getOrder(OrderId)
    {
        const promiseResult = OrderModel.getOrder({_id: OrderId});
        return promiseResult;
    }

    removeAllOrders()
    {
        const promiseResult = OrderModel.deleteAllOrder();
        return promiseResult;
    }

    deleteAllOrder() {
        const result = OrderModel.deleteAllOrder();
        return result;
    }
}