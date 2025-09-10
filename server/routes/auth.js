const router = require("express").Router();
const {User} = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privatekey = process.env.JWTPRIVATEKEY;

//check user when sigining in (regular)
router.post("/login", async(req, res) => {
    // check whether user is in the database
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.status(400).send({message: "Invalid email or password"});
    }

    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if (!validPwd) {
        return res.status(400).send({message: "Invalid email or password"});
    }
    else {
        const token = jwt.sign({ _id: user._id }, privatekey, { expiresIn: '1h' });
        res.cookie("token", token, {
            httpOnly: true, // Protects against XSS
            maxAge: 3600000, // Cookie expires in 1 hour
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        const user_id = user._id;
        res.status(200).send({data: token, message: "Login successfully!", id: user_id});
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' });
    res.status(200).send({ message: 'Logged out successfully' });
});



module.exports = router;