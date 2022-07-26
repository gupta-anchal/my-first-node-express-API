const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const secretkey = process.env.JWTSECRETKEY;
const bcrypt = require("bcrypt");

var SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.TWILIO_EMAIL_KEY;

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.TWILIO_EMAIL_KEY);

// SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =process.env.TWILIO_EMAIL_KEY;

exports.create = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const full_name = `${first_name} ${last_name}`;

    const token = await jwt.sign({ data: { email: email } }, secretkey, {
      expiresIn: "10h",
    });
    const url = `${process.env.HOST}:${process.env.PORT}/users/verify-email/${token}`;

    const hashedPass = await bcrypt.hash(password, 10);

    await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPass,
    });

    new SibApiV3Sdk.TransactionalEmailsApi()
      .sendTransacEmail({
        subject: "Team Dev Account Verification Link",
        sender: { email: "support@teamdev.com", name: "Team Dev" },
        to: [{ name: full_name, email: email }],
        htmlContent: `<html><body><h3><a id="button_validation" href=${url} target="_blank">Click here</a> to verify email.</h3></body></html>`,
        // params: { bodyMessage: "Made just for you!" },
      })
      .then(
        function (data) {
          console.log(data);
          return res.status(200).json({
            success: true,
            message: "Verification link sent to email, please verify!",
          });
        },
        function (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again!",
          });
        }
      );
  } catch (error) {
    console.log("error : ", error);
    res.status(500).send("Server Error!");
  }
};

exports.verifyemail = async (email) => {
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      await User.updateOne(
        { email: email },
        { $set: { is_email_verified: true } }
      );
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error", error);
  }
};

    exports.getAll = async(req,res)=> {
        try {
            let users = await User.find();
            res.status(200).json({
                success : true,
                message : "Users found successfully",
                data : users
            })  
        } catch (error) {
            console.log("error :", error);
            res.status(500).send("Server Error!");
        }
    }

    exports.getOne = async(req,res)=> {
        try {
            let user = await User.findById(req.params.id);
            res.status(200).json({
                success : true,
                message : "User found successfully",
                data : user,
            })  
        } catch (error) {
            console.log("error :", error);
            res.status(500).send("Server Error!");
        }
    }

    exports.UpdateAllUserData = async(req,res)=> {
        try {
            const {first_name, last_name, email} = req.body;
            await User.updateOne(
                {email : email},
                {$set: {first_name: first_name, last_name: last_name}}
            );
            let user = await User.find({email : email});
            res.status(200).json({
                success : true,
                message : "User updated successfully",
                data : user,
            })  
        } catch (error) {
            console.log("error :", error);
            res.status(500).send("Server Error!");
        }
    }

    exports.deleteOne = async(req,res)=> {
        try {
            let user = await User.deleteOne({_id: req.params.id});
            res.status(200).json({
                success : true,
                message : "User deleted successfully",
                data : user,
            })  
        } catch (error) {
            console.log("error :", error);
            res.status(500).send("Server Error!");
        }
    }

    exports.SetActiveUser = async(req,res)=> {
        try {
            const {first_name, last_name, email} = req.body;
            await User.updateOne(
                {_id : req.params.id},
                {$set: {active: "true"}}
            );
            let user = await User.find({_id : req.params.id});
            res.status(200).json({
                success : true,
                message : "User status active updated successfully",
                data : user,
            })  
        } catch (error) {
            console.log("error :", error);
            res.status(500).send("Server Error!");
        }
    }

    exports.login = async(req,res)=> {
        try {
            const {email, phone_number, password} = req.body;
            let user = await User.findOne({
                email : email
              });
            if(!user) {
                return res.status(404).json({
                    success : false,
                    message : "Invalid credentials",
                })
            }  
                bcrypt.compare(password, user.password).then((isMatch) => {
                    if(isMatch){
                        let token = jwt.sign ({
                            user : {
                                id: user.id,
                            },
                        },
                        secretkey, {
                            expiresIn : "1h"
                        })

                        return res.status(200).json({
                            success : true,
                            message : "User login successfull",
                            token: token,
                        })
                    }

                    else {
                        return res.status(403).json({
                            success : false,
                            message : "Incorrect PASSWORD",
                        })
                    }
                })          

        } catch (error) {
            console.log("error :", error);
            res.status(500).send("Server Error!");
        }
    }

    exports.passwordReset = async(req,res)=> {
        try {
            const {email, phone_number, old_password, new_password} = req.body;
            let user = await User.findOne({ //findAndUpdate
                $or: [{
                  "email": email
                }, {
                  "phone_number": phone_number
                }],
                password : old_password
              });
              console.log("user is :",user);
            if(!user){
                res.status(404).json({
                    success : false,
                    message : "Invalid credentials",
                })
            }  
            else {
                await User.updateOne(
                    {email : email},
                    {$set: {password: new_password}}
                );
                let user = await User.find({email : email});
                res.status(200).json({
                    success : true,
                    message : "User updated successfully",
                })  
            }
        } catch (error) {
            console.log("error :", error);
            res.status(500).send("Server Error!");
        }
    }