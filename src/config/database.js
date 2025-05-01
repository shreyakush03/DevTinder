// logic to connect to the database
const mongoose = require("mongoose")
// connecting to the database

const connectDb = async () => {

    await mongoose.connect(
        "mongodb+srv://shreya_kush10:mondler%40321@namatejs.uxepqkm.mongodb.net/devTinder"
    ) //returns a promise
}

module.exports = connectDb

