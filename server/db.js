const mongoose = require("mongoose");

module.exports = async () => {
    try{
        mongoose.connect(process.env.DB);
        console.log("Successfully connected to DB");
    }
    catch(e) {
        console.error("Connect DB Error: " + e);
    }
}