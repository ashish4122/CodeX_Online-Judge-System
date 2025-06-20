const mongoose = require('mongoose');

const dbConnection = () => {mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB Connected...');
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    })
}
module.exports = dbConnection;