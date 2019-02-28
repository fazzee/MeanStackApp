const express = require("express");
const Post = require('../models/post');

const Router = express.Router();

Router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
 post.save().then(createdPost => {
  res.status(201).json({
    message: "Post Added Successfully",
    postId: createdPost._id
  });
 });

});

Router.put("/:id", (req, res, next) =>{
  const post = new Post({
    id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  post.updateOne({_id: req.params.id, post}).then(result => {
    res.status(200).json({
      message: "Update Successful!"
    });
  });
});

Router.get("",(req, res, next) => {

  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts Fetched Successfully",
      posts: documents
 });
  });


});

Router.get("/:id",(req, res, next) => {
   Post.findById(req.params.id).then(post =>{
        if(post){
          res.status(200).json(post);
        }else{
          res.status(404).json({message: "Post Not Found"});
        }
   });
});

Router.delete("/:id",(req, res, next) => {

  Post.deleteOne({_id: req.params.id}).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post Deleted"
 });
  });


});

module.exports = Router;
