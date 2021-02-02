//Requiring the necessay files, middlewares and packages
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
//Requiring the necessary objects
const user = require('../business/Objects').USER;
const garageOwner = require('../business/Objects').GARAGEOWNER;
const report = require('../business/Objects').REPORT;

//Information of the mailer
const reportTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'b2b.report.generator@gmail.com',
        pass: 'b2bgp2020'
    }
});

module.exports = {
//----------Send garage owner report----------
    generateGarageOwnerReport()
    {
        const garageOwnerReport = schedule.scheduleJob('0 0 1 * *', () => {
        // const garageOwnerReport = schedule.scheduleJob('* * * * *', () => {
            //Getting all the garageOwners
            user.getAllUsersIdOfARole('garageOwner')
            .then(garageOwners => {
            //Looing through the grageowners to send email for each one
            garageOwners.forEach(garageOwnerId => {
                //Gettin user information
                user.getUserById(garageOwnerId._id)
                    .then(garOwner => {
                    //Getting the garagegOwner from the userId
                    garageOwner.getGarageOwnerByUserId(garageOwnerId._id)
                        .then(retrivedgarageOwner => {
                        //Getting the report
                        report.getReport(retrivedgarageOwner.reportId)
                            .then(retrivedReport => {
                            reportForGarageOwner = `Total Income this month ${retrivedReport.totalIncome}\nNumber of delivered orders ${retrivedReport.listOfSoldItems.length}\nNumber of cancel orders ${retrivedReport.listOfCancelItems.length}`;
                            var mailOptions = {
                                from: 'b2b.report.generator@gmail.com',
                                to: garOwner.email,
                                subject: `Garage Owner, Month:${new Date().getMonth() + 1}/${new Date().getFullYear()} Report`,
                                text: `Hello ${garOwner.fullName}, this is the report for the current month.\n${reportForGarageOwner}\nBest wishes, B2B team`,
                            };
                            //Sending mail
                            reportTransporter.sendMail(mailOptions, function (err, info) {
                                if (err)
                                    console.log({error:"Email wasn't sent !    "+err});
                                else 
                                {
                                    report.clearReport(retrivedReport._id).then(clearedReport => {
                                        console.log({success:'Email sent: ' + info.response});
                                    });
                                }
                            });
                            })
                            //If retrieving orders runs into error, then console an error log
                            .catch(err => console.log({error:"Error in generating report -Retrieving Orders- ! " + err}));
                        })
                        //If getting garageowner runs into error, then console an error log
                        .catch(err => console.log({error:"Error in generating report -Getting garage owner by userId- ! " + err}));
                    })
                    //If generating user runs into error, then console an error log
                    .catch(err => console.log({error:"Error in generating report -Getting user by id- ! " + err}));
                });//End of foreach
            })
            //If getting all the garageOwners runs into error, then console an error log
            .catch(err => console.log({error:"Error in generating report -Getting garage owners- ! " + err}));
        });
    }
,
//----------Send admin report----------
    generatingAdminReport() 
    {
        const adminReport = schedule.scheduleJob('0 0 1 * *', () => {
        // const adminReport = schedule.scheduleJob('* * * * *', () => {
            //Getting all garageOwners
            user.getAllUsersIdOfARole('garageOwner')
            .then(garageOwners => {
            //Getting all carOwners
            user.getAllUsersIdOfARole('carOwner')
                .then(carOwners => {
                //Getting all waitingUsers
                user.getAllUsersIdOfARole('waitingUser')
                    .then(waitingUsers => {
                    //Preapairing the reort data
                    reportForAdmin = `#of Garage Owners: ${garageOwners.length}\n#of Car Owners: ${carOwners.length}\n#of Waiting Users: ${waitingUsers.length}\n`;
                    //Getting all admins
                    user.getAllUsersIdOfARole('admin')
                        .then(admins => {
                            //Looping through admins to send email foreach one
                            admins.forEach(adminId => {
                                //Getting user information
                                user.getUserById(adminId._id)
                                    .then(admin => {
                                    var mailOptions = {
                                        from: 'b2b.report.generator@gmail.com',
                                        to: admin.email,
                                        subject: `Admin, Month:${new Date().getMonth() + 1}/${new Date().getFullYear()} Report`,
                                        text: `Hello ${admin.fullName},this is the report for the current month.\n${reportForAdmin}\nBest wishes, B2B team`,
                                    };
                                    //Sending mail
                                    reportTransporter.sendMail(mailOptions, function (err, info) {
                                        if (err)
                                            console.log({error:"Email wasn't sent !    "+err});
                                        else
                                            console.log({success:'Email sent: ' + info.response});
                                    });
                                    })
                                    //If getting admin runs into error, then console an error log
                                    .catch(err => console.log({error: "Error getting the admin by id. " + err}));
                            }); //End of for each
                        })
                        //If getting all admins runs into error, then console an error log
                        .catch(err => console.log({error: "Error getting all the admins owners. " + err}));
                    })
                    //If getting waitingUsers runs into error, then console an error log
                    .catch(err => console.log({error: "Error getting all the waiting users. " + err}));
                })
                //If getting carOwners runs into error, then console an error log
                .catch(err => console.log({error: "Error getting all the car owners. " + err}));
            })
            //If getting garageowners runs into error, then console an error log
            .catch(err => console.log({error: "Error getting all the garage owners. " + err}));
        });
    }

}