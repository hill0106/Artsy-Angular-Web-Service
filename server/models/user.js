const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const pwdComplexity = require("joi-password-complexity");
const fs = require("fs");

const privatekey = process.env.JWTPRIVATEKEY;

// database schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profileImageUrl: {type: String, default: ""},
    favorite: [{
        artistId: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
        likedAt: { type: Date, default: Date.now },
        name: { type: String },
        birthday: { type: String },
        deathday: { type: String },
        nationality: { type: String },
        image: { type: String } ,
        isFavorite: {type: Boolean},
        biography: {type: String}    
    }],
});

//favorite         
// {
//     name: 'The Japanese Footbridge',
//     artistId: '1',
//     birth: '1899',
//     death: '',
//     nationality: 'French',
//     likedAt: new Date(Date.now() - 30000),
//     img: 'https://images.unsplash.com/photo-1599503613556-0f18b122d281?q=80&w=1285&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
// }

userSchema.methods.generateAuthToken = (user) => {
    var payload = {_id: user._id, name: user.name, isAdmin: user.isAdmin};
    const token = jwt.sign(
        payload,
        privatekey,
        {expiresIn: "1h"}
    );
    return token;
}

const validate = (user) => {
    const schema = joi.object({
        name: joi.string().min(2).max(10).required(),
        email: joi.string().email().required(),
        password: pwdComplexity().required(),
    });
    return schema.validate(user);
}

const User = mongoose.model("user", userSchema);

module.exports = {User, validate};