const express = require("express");
const userFunctions = require("../controllers/user");



const Router = express.Router();

Router.post("/signup", userFunctions.createUser);

Router.post("/login", userFunctions.loginUser);





module.exports = Router;
