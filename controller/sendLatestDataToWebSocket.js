const db = require('../models/smarthomeConnect');

//get current temperature and humidity and send it to WebSocket
function sendLatestDataToWebSocketClients(wss) {
    db.temperature.findOne({
        order: [['createdAt', 'DESC']], 
    })
        .then(latestTemperature => {
            return db.humidity.findOne({
                order: [['createdAt', 'DESC']], 
            })
                .then(latestHumidity => {
                    const dataToSend = {
                        temperature: latestTemperature ? latestTemperature.temperature : null,
                        humidity: latestHumidity ? latestHumidity.humidity : null,
                    };

                    wss.clients.forEach(client => {
                        client.send(JSON.stringify(dataToSend));
                    });
                });
        })
        .catch(error => {
            console.error('Error fetching latest data:', error);
        });
}


  module.exports = sendLatestDataToWebSocketClients;