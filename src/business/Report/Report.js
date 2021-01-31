//Requiring the necessary files and models
const ReportModel = require('../../models/model/Report');

module.exports = class Report{
    createReport(reportInfo) {
        const result = ReportModel.createReport(reportInfo);
        return result;
    }

    updateReport(updatedreport) {
        const result = ReportModel.updateReport(updatedreport);
        return result;
    }

    deleteReport(reportId) {
        const result = ReportModel.deleteReport({
            _id: reportId
        });
        return result;
    }

    getReport(reportId) {
        const result = ReportModel.getReport({
            _id: reportId
        });
        return result;
    }

    getAllReports() {
        const result = ReportModel.getAllReports();
        return result;
    }

    addOrder(reportId, orderId) {        
        const result = ReportModel.addOrder({_id: reportId, orderId: orderId});
        return result;
    }

    addCancelOrder(reportId, orderId) {
        const result = ReportModel.addCancelOrder({_id: reportId, orderId: orderId});
        return result;
    }

    clearReport(reportId) {
        const result = ReportModel.clearReport({_id: reportId});  
        return result;
    }
}