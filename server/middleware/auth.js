const jwt = require("jsonwebtoken");
const {User} = require("../models/user");
const privatekey = process.env.JWTPRIVATEKEY;

module.exports = async(req, res, next) => {
    const token = (req.cookies && req.cookies.token) || req.header("x-auth-token");
    if (!token) {
        return res.status(401).send({message: "Access denied, no token provided"});
    }
    try {
        const decoded = jwt.verify(token, privatekey);
        const user = await User.findById(decoded._id);
        if(!user) return res.status(401).send({message: "Access denined"});
        req.user = user;
        next();
    }   
    catch(err) {
        return res.status(400).send({message: "Invalid token"});
    }
};