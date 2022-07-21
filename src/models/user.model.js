const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name : {
        type : String,
    },
    last_name : {
        type : String,
    },
    email : {
        type : String,
        unique : true,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    active : {
        type : Boolean,
        default : false,
    }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;