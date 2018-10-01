const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
import validateRegisterInput from '../../validation/register';
import validateLoginInput from '../../validation/login';

// load User Model
import User from '../../models/User';

router.get('/test', (req, res) => res.json({msg: "Users works"}));
// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // check vali
    if(!isValid) {
        return res.status(400).json(errors)
    }
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({email: "Email already exist"});
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // size
                    r: 'p', // Rating
                    d: 'mm', // Default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

// @route POST api/users/login
// @login User / return JWT
// @access Public

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    // check vali
    if(!isValid) {
        return res.status(400).json(errors)
    }

    const { email, password } = req.body;

    User.findOne({email})
        .then(user => {
            // Check for user
            if(!user) {
                return res.status(404).json(errors)
            }
            // Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {

                    if(isMatch) {
                        // user match
                        const payload = {id: user.id, name: user.name, avatar: user.available}

                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            {expiresIn: 3600},
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        );
                    }

                    else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors)
                    }
                })
        })
});
// @route Get api/users/current
// @login Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
    })
});

module.exports = router;