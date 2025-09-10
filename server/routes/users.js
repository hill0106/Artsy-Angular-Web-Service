const router = require("express").Router();
const {User, validate} = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const validObjectID = require("../middleware/validObjectId");
const crypto = require('crypto');
const { getToken } = require('../fetchToken');
const axios = require('axios');
const jwt  = require("jsonwebtoken");
const privatekey = process.env.JWTPRIVATEKEY;
 
function getGravatarUrl(email, size = 80) {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}


//create user
router.post("/signup", async(req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send({message: error.details[0].message});
    }
    // check whether user is in the database
    const user = await User.findOne({email: req.body.email});
    if (user) {
        return res.status(403).send({message: "Hi, you've already registered!"});
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPwd = await bcrypt.hash(req.body.password, salt);
    let newUser = await new User({
        ...req.body,
        password: hashPwd
    }).save(); //save to database collection: user


    newUser.password = undefined;
    newUser.__v = undefined;

    // after create a new user, create profile URL
    try {      
        
        const email = req.body.email;
        const authenticatedUser = await User.findById(newUser._id);
        if (!authenticatedUser) {
            console.error('User not found');
            return res.status(403).send({ message: 'Access denied' });;
        }  
        const gravatarUrl = getGravatarUrl(email, 200);
 
        // console.log('Gravatar URL:', gravatarUrl);
        authenticatedUser.profileImageUrl = gravatarUrl;
        await authenticatedUser.save();

        const token = jwt.sign({ _id: newUser._id }, privatekey, { expiresIn: '1h' });
        res.cookie("token", token, {
            httpOnly: true, // Protects against XSS
            maxAge: 3600000, // Cookie expires in 1 hour
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        return res.status(200).send({data: {authenticatedUser}, message: "Register and login successfully!"});

   }
   catch(e) {
    console.log(e);
   }

});

router.post("/check", async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).json({ error: "Email query parameter is required" });
        }
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(200).send({ message: 'User exists' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
});



//get user by ID (auth)
router.get("/:id", [auth], async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -__v");
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ data: user });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
      // req.user is set in the auth middleware; assume it contains { id: 'userId', ... }
      const user = await User.findById(req.user._id).select('-password -__v');
      if (!user) return res.status(404).send({ message: 'User not found' });
      res.status(200).send({ data: user });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Server error' });
    }
});

//update user by ID
router.put("/:id", [validObjectID, auth], async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        ).select("-password -__v");
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ data: user });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
});

//delete user
router.delete("/", auth, async (req, res) => {
    try {
        const users = await User.findById(req.user._id).select("-password -__v");
        if (!users) {
            return res.status(404).send({ message: 'Users not found' });
        }
        await User.findByIdAndDelete(req.user._id);
        res.status(200).send({message: "Delete user successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
});

//liked artist
router.get("/liked/:artist_id", auth, async(req, res) => {
    try {
        // Check if the artist belongs to the authenticated user
        const user = await User.findOne(req.user._id);
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
        const userFav = await User.findOne({_id: req.user._id, "favorite.artistId": req.params.artist_id});
        if (userFav) {
            return res.status(404).send({ message: "Artist is already in the favorites" });
        }
        const artistApiUrl = `https://api.artsy.net/api/artists/${encodeURIComponent(req.params.artist_id)}`;
        const headers = {
          'X-XAPP-Token': getToken(), // Use the getter to retrieve the token
          'Content-Type': 'application/json',
        };
        let artist;

        try {
          const response = await axios.get(artistApiUrl, { headers });
          artist = response.data;
        //   console.log(artist);
        } catch (error) {
          console.error('Error in artist route:', error.message);
        }

        user.favorite.push({
            artistId: req.params.artist_id,
            likedAt: new Date(),
            name: artist.name,
            birthday: artist.birthday ? artist.birthday : "",
            deathday: artist.deathday ? artist.deathday : "",
            nationality: artist.nationality ? artist.nationality : "",
            image: artist._links.thumbnail === undefined ? "/assets/images/artsy_logo.svg" : artist._links.thumbnail.href,
            isFavorite: true,
            biography: artist.biography ? artist.biography : ""
          });

        await user.save();
        res.status(200).send({message: "Liked artist successfully", data: user});
    }
    catch(err) {
        console.log(err);
        res.status(500).send("Server Error "+ err);
    }
  });
  
//remove liked artist
router.delete("/rmliked/:artist_id", auth, async(req, res) => {
try {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    
    const originalLength = user.favorite.length;
    user.favorite = user.favorite.filter(fav => fav.artistId.toString() !== req.params.artist_id);

    // If no artist was removed, return an error message
    if (user.favorite.length === originalLength) {
        return res.status(404).send({ message: "Artist not found in favorites" });
    }
    await user.save();

    res.status(200).send({message: "Removed liked artist successfully", data: user});
}
catch(err) {
    console.log(err);
    res.status(500).send("Server Error "+ err);
}
});

module.exports = router;