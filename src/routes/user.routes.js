const express = require("express");

const UserController = require("../controllers/user.controller");

const {isValid} = require("../validators/validToken")

const router = express.Router();

//method : POST
//ROUTE : "/users"
//access : "public"
//desc : "save user"
//to create a user
router.post("/", UserController.save)

//to get all user
//method : POST
//ROUTE : "/users"
//access : "private"
//desc : "get all user"
router.get("/", [isValid, UserController.getAll])

//to get a user
router.get("/:id", UserController.getOne)

//to delete a user
router.delete("/:id",UserController.deleteOne)

//to update all user data
router.put("/", UserController.UpdateAllUserData)

//to update a field in user
router.patch("/:id",UserController.SetActiveUser)

router.post("/login",UserController.login);

module.exports = router;