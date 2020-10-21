
const CustomerUsers = require('../model/CustomerUser.model.js');


// Importing JSON web Token
const jwt = require("jsonwebtoken");
let fetchedUser;
// importing password auto generator to generate random password
const PasswordGenerator = require('strict-password-generator').default;

const passwordGenerator = new PasswordGenerator();
let password = passwordGenerator.generatePassword()
//------------------------------------------------------------------------------------------------


exports.create = (req, res) => {
    // Checking in the database, does given email id exists in the database
    CustomerUsers.find({ customerUserEmail: req.body.customerUserEmail }).count()
        .then(customerusers => {
            if (customerusers == 0) {
                bcrypt.hash(password, 10).then(hash => {
                    const customeruser = new CustomerUsers({


                        customerUserPassword: hash,
                        customerUserName: req.body.customerUserName,
                        customerUserEmail: req.body.customerUserEmail,

                    });


                    // Save User in the MongoDB
                    customeruser.save()
                        .then(data => {

                            //-----------------------Email Integration Code------------------------------------
                            if (!data) {
                                return res.status(404).json({
                                    msg: "User not saved"
                                });
                            }
                        })

                }).catch(err => {
                    res.status(500).send({
                        msg: err.message
                    });
                });
                res.json(customerusers);
            }
            else {
                res.json(customerusers);
            }
        }).catch(err => {
            res.status(500).json({
                msg: err.message
            });
        });
};

exports.findAll = (req, res) => {
    CustomerUsers.find()
        .then(customerusers => {
            res.json(customerusers);
        }).catch(err => {
            res.status(500).send({
                msg: err.message
            });
        });
};


exports.findOne = (req, res) => {
    CustomerUsers.findById(req.params.customerUserEmail)
        .then(customerusers => {
            if (!customerusers) {
                return res.status(404).json({
                    msg: "User not found with id " + req.params.customerUserEmail
                });
            }
            res.json(customerusers);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).json({
                    msg: "User not found with id " + req.params.customerUserEmail
                });
            }
            return res.status(500).json({
                msg: "Error retrieving User with id " + req.params.customerUserEmail
            });
        });
};

exports.update = (req, res) => {

    // Find customer and update it
    CustomerUsers.findByIdAndUpdate(req.body._id, req.body, { new: true })
        .then(customerusers => {
            if (!customerusers) {
                return res.status(404).json({
                    msg: "User not found with id " + req.params.customerUserEmail
                });
            }
            res.json(customerusers);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).json({
                    msg: "User not found with id " + req.params.customerUserEmail
                });
            }
            return res.status(500).json({
                msg: "Error updating customerusers with id " + req.params.customerUserEmail
            });
        });
};

exports.delete = (req, res) => {
    CustomerUsers.findByIdAndRemove(req.params.customerUserEmail)
        .then(customerusers => {
            if (!customerusers) {
                return res.status(404).json({
                    msg: "customerusers not found with id " + req.params.customerUserEmail
                });
            }
            res.json({ msg: "customerusers deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    msg: "customerusers not found with id " + req.params.customerUserEmail
                });
            }
            return res.status(500).json({
                msg: "Could not delete user with id " + req.params.customerUserEmail
            });
        });
};

// Customer User login Function

exports.login = (req, res, next) => {
    CustomerUsers.findOne({ customerUserEmail: req.body.customerUserEmail, customerUserStatus: 'Active' })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Invalid Email and Password! Please try again"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.customerUserPassword, user.customerUserPassword);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth Failed!"
                });
            }
            //console.log("login");
            //console.log(req.body.customerUserEmail);
            const token = jwt.sign(

                {
                    customerUserName: fetchedUser.customerUserName,
                    customerUserEmail: fetchedUser.customerUserEmail
                },

                "secret_this_should_be_longer",
                { expiresIn: "1h" }
            );

            res.status(200).json({
                token: token,
                expiresIn: 10800,

                customerUserName: fetchedUser.customerUserName,
                customerUserEmail: fetchedUser.customerUserEmail

            });
        })
        .catch(err => {
            //console.log("error");
            return res.status(401).json({
                message: "Invalid authentication credentials!"
            });
        });
};



//Finding current logged in customer user
exports.findCurrentLogedInCustomerUser = (req, res) => {
    CustomerUsers.find({ customerId: req.params.customerId })
        .then(customerusers => {
            if (!customerusers) {
                return res.status(404).json({
                    msg: "User not found with id " + req.params.customerId
                });
            }
            res.json(customerusers);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).json({
                    msg: "User not found with id " + req.params.customerId
                });
            }
            return res.status(500).json({
                msg: "Error retrieving User with id " + req.params.customerId
            });
        });
};

// Checking the password
exports.checkPassword = (req, res) => {
    CustomerUsers.findOne({ customerUserEmail: req.body.customerUserEmail })
        .then(user => {
            if (!user) {
                return res.json(false);
            }
            else {
                bcrypt.compare(req.body.customerUserPassword, user.customerUserPassword)
                    .then(result => {
                        if (!result) {
                            return res.json(result)
                        }
                        else {
                            bcrypt.hash(req.body.customerUserId, 10).then(hashpassword => {
                                CustomerUsers.findOneAndUpdate({ customerUserEmail: req.body.customerUserEmail }, { customerUserPassword: hashpassword })
                                    .then(user => {
                                        if (!user) {
                                            return res.json(false);
                                        }
                                        else {
                                            res.json(true);
                                        }

                                    }).catch(err => {
                                        if (err.kind === 'ObjectId') {
                                            // return res.json(true);
                                        }
                                        else {
                                            // return res.json(false);
                                        }

                                    });
                            });
                        }
                    })
            }
        })

};
