//Requiring the necessary packages
const schedule = require('node-schedule');
const http = require("http")

module.exports = {
    //----------Send garage owner report----------
        train()
        {
            const startTrainModelForSearchByImage = schedule.scheduleJob('0 0 * * *', () => {
                let url = new URL("http://localhost:8000/start-training")
                http
                    .request(
                        url,
                        res => {
                           console.log('Model Was Trained')
                        }
                    )
                    .end()
            });
        }
};
