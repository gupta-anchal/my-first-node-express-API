const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const jwtSecretKey = process.env.JWTSECRETKEY;

exports.isValid = async (req, res, next) => {
  // Get token from header
  //Verify token
  try {
    const token = req.header("Authorization");
    //Check if not token
    if (!token) {
      return res.status(401).json({ msg: "No Token, authrization denied" });
    }
    const decoded = jwt.verify(token, jwtSecretKey);
    req.user = decoded.user;
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      next();
    } else {
      return res.status(401).json({ msg: "User not exist anymore" });
    }
    // console.log(req.user)
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};