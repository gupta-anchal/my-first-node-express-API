const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const secretkey = "dflkjddk32scmk";
const bcrypt = require("bcrypt");

exports.create = async(req,res)=> {
    try {
        const {first_name, last_name, email, password} = req.body;

        const hashedPass = await bcrypt.hash(password, 10);
        console.log("hashedPass",hashedPass);

        let user = await User.findOne({email : email});
        if(user){
            return(res.status(403).json({
                success : false,
                message : "User Already existing"
            }))
        }
        await User.create({
            first_name : first_name, 
            last_name : last_name, 
            email : email, 
            password : hashedPass,
        });

        res.status(201).json({
            success : true,
            message : "User created successfully"
        })
    }
    catch(error) {
        console.log("error", error);
        res.status(500).send("Server error")
    }
}

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
            let user = await User.find({
                email : email
              });
              console.log(user);
            if(user.length===0) {
                return res.status(404).json({
                    success : false,
                    message : "Invalid credentials",
                })
            }  
                bcrypt.compare(password, user[0].password).then((isMatch) => {
                    if(isMatch){
                        let token = jwt.sign ({
                            user : {
                                id: user[0].id,
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
                        return res.status(404).json({
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