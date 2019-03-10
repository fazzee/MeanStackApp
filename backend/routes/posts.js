const postFunctions = require('../controllers/post');

const express = require("express");

const CheckAuth = require("../middleware/check-auth");
const fileMiddleware = require("../middleware/file");
const Router = express.Router();



Router.post("", CheckAuth, fileMiddleware, postFunctions.createPost);

Router.put("/:id", CheckAuth, fileMiddleware, postFunctions.updatePost);

Router.get("", postFunctions.getPosts);

Router.get("/:id", postFunctions.getPost);

Router.delete("/:id", CheckAuth, postFunctions.deletePost);

module.exports = Router;
