const {user_register} = require("../models")
const bcrypt = require("bcrypt")
const saltRounds = 12
const jwt = require("jsonwebtoken")
const privateKey = "null"

module.exports = {
    // create user.
    createUser: (req, res) => {
        user_register.findOne({where: {email: req.body.email}}).then((user) => {
            if(user) {
                // if register with the same email. show message email already exists.
                return res.status(401).json({email: "Email already exists!"})
            } else {
                // create new user (register).
                const newUser = new user_register ({
                    username: req.body.username,
                    email: req.body.email,
                    image: req.file && req.file.path,
                    password: req.body.password,
                    passwordConfirm: req.body.passwordConfirm
                })
                // hash password.
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if(err) throw err
                        newUser.password = hash; // hash password.
                        newUser
                        .save()
                        .then((result) => {
                            // password confirm.
                            if(req.body.password !== req.body.passwordConfirm) {
                                res.json("Password undefined!")
                            } else {
                                req.body.password == req.body.passwordConfirm
                                res.json(result)
                            }
                        })
                        .catch((err) => {
                            throw err
                        })
                    })
                })
            }
        })
    },
    // user login.
    login: (req, res) => {
        // declare email and password.
        const {email, password} = req.body
        if(email && password) {
            user_register.findOne({where: {email:email}}). then((user) => {
                if(!user) {
                    return res.status(404).json({emailnotfound: "Email not found!"})
                }
                // check password.
                bcrypt.compare(password, user.password).then((isMatch) => {
                    console.log(isMatch);
                    if (isMatch) {
                        // user matched create jwt payload.
                        const payload = {
                            id: user.id,
                            email: user.email
                        }
                        // sign token.
                        jwt.sign(
                            payload,
                            privateKey,
                            {
                                expiresIn: 60*60
                            },
                            (err, token) => {
                                res.json({
                                    success: true + " " + "Users Session",
                                    token: token,
                                    id: user.id,
                                    email: user.email,
                                    username: user.username
                                })
                            }
                        )
                    } else {
                        return res
                        .status(400)
                        .json({passwordincorrect: "Password incorrect!"})
                    }
                })
            })
        }
    },
    // get all data.
    getAllData: (req, res) => {
        user_register.findAll()
        .then((result => res.json(result)))
        .catch((err) => res.json(err))
    }
}