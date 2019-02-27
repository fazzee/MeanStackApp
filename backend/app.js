const express = require('express');
const BodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');

const app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb+srv://faaizi:Y2Q5cGXxHbfmi2ti@cluster0-xsrq9.mongodb.net/mean-db?retryWrites=true")
.then(() =>{
  console.log("Connected Successfully");
})
.catch(() => {
  console.log("Connection Failed");
});


app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
   "Origin, X-Requested-With, Content-Type, Accept");
   res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});


app.post("/api/posts", (req, res, next) => {
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

app.get("/api/posts",(req, res, next) => {

  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts Fetched Successfully",
      posts: documents
 });
  });


});

app.delete("/api/posts/:id",(req, res, next) => {

  Post.deleteOne({_id: req.params.id}).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post Deleted"
 });
  });


});


module.exports = app;
