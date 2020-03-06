const router = require('express').Router();
const bcrypt = require('bcryptjs'); // Include for password hashing
const jwt = require('jsonwebtoken'); // Include to generate Token
const User = require('../models/User');
// Include for field validation using @hapi/joi
const { userRegisterValidation, userLoginValidation} = require('../validation');

// POST API to register new user
router.post('/register', async (req, res) => {
    // Validate request before creating user
    const validation = userRegisterValidation(req.body);

    // Return if validation didnt pass
    if (validation.error) return res.status(400).send(validation.error.details[0].message);;

    // Duplicate check using email
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send(`User already exist with email: ${req.body.email}`);

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashPAssword = await bcrypt.hash(req.body.password, salt);

    // Create user model
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPAssword,
    });

    try {
        // Create new user in DB
        const savedUser = await user.save();
        // Return User ID
        res.send({
            user: savedUser._id
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});

// POST API for user to login
router.post('/login', async (req, res) => {
     // Validate request before checking user login
     const validation = userLoginValidation(req.body);
     if (validation.error) return res.status(400).send(validation.error.details[0].message);;
    
     // Check if email exist
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email doesnt exist.');

    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid login.');

    // Create and assign a token to logged in user
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

    res.header('auth-token', token).send({
        login: true,
        message: 'Login successful'
    });
});

module.exports = router;