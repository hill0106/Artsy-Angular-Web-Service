const mongoose = require("mongoose");

module.exports = (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(404).send({message: "Invalid User ID"});
    }
    next();
}