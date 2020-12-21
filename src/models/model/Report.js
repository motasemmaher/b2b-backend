const mongoose = require('mongoose')
const ReportSchema = require('../schema/Report');

const ReportModel = mongoose.model('Report', ReportSchema);
const OrderModel = require('./Order');

module.exports = {
    createReport(value) {
        const result = ReportModel.create(value);
        if (result)
            return result;
        else
            return {
                error: "Error with the creation Report"
            };
    },

    updateReport(value) {
        const result = ReportModel.findOneAndUpdate({
            _id: value._id
        }, value, {
            "useFindAndModify": false
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the updating Report"
            };
    },

    deleteReport(value) {
        const result = ReportModel.findOneAndDelete({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the deletion Report"
            };
    },

    getReport(value) {
        const result = ReportModel.findOne({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting the Report"
            };
    },

    getAllReports() {
        const result = ReportModel.find({});
        if (result)
            return result;
        else
            return {
                error: "Error with the getting the all Report"
            };
    },

    async addOrder(value) {
        let result = null;
        await ReportModel.findOne({
            _id: value._id
        }).then(async report => {
            report.listOfSoldItems.push(value.orderId);
            report.totalIncome = 0;
            await report.listOfSoldItems.forEach(async (element, index) => {
                await OrderModel.getOrder(element).populate('shoppingCart').then(retrivedOrder => {
                    if(index === report.listOfSoldItems.length - 1) {
                        result = report.save();
                    }
                    report.totalIncome += retrivedOrder.shoppingCart.totalBill;
                });
            });
        });

        if (result)
            return result;
        else
            return {
                error: "Error with the adding order to the Report"
            };
    }
}