const express = require("express");

const UserController = require("../controllers/user.controller");

const router = express.Router();

//to create a user
router.post("/", UserController.save)

//to get all user
router.get("/", UserController.getAll)

//to get a user
router.get("/:id", UserController.getOne)

//to delete a user
router.delete("/:id",UserController.deleteOne)

//to update all user data
router.put("/", UserController.UpdateAllUserData)

//to update a field in user
router.patch("/:id",UserController.SetActiveUser)

module.exports = router;