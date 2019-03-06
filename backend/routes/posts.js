const express = require("express");
const Post = require('../models/post');
const multer = require('multer');
const CheckAuth = require("../middleware/check-auth");

const Router = express.Router();

const MIME_TYPE_MAP = {
  "image/png" : "png",
  "image/jpeg" : "jpg",
  "image/jpg" : "jpg"
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("MIME type Error");
    if(isValid){
      error = null;
    }
     cb(error, 'backend/images');
  },
  filename : (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

Router.post("", CheckAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creater: req.userData.userId
  });
 post.save().then(createdPost => {
  res.status(201).json({
    message: "Post Added Successfully",
    post: {
       ...createdPost,
      id: createdPost._id
    }
  });
 });

});

Router.put("/:id", CheckAuth, multer({storage: storage}).single("image"), (req, res, next) =>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  post.updateOne({_id: req.params.id, creater: req.userData.userId}, post).then(result => {
    if(result.nModified > 0){
      res.status(200).json({
        message: "Update Successful!"
      });
    }else{
      res.status(401).json({
        message: "Authorization Failed!!"
      });
    }

  });
});

Router.get("",(req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fethcedposts;
  if(pageSize && currentPage){
    postQuery.skip(pageSize *(currentPage - 1)).limit(pageSize);
  }
  postQuery.then(documents => {
    fethcedposts = documents;
    return Post.countDocuments();
 }).then(count => {
  res.status(200).json({
    message: "Posts Fetched Successfully",
    posts: fethcedposts,
    maxPosts: count
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

Router.delete("/:id", CheckAuth,(req, res, next) => {

  Post.deleteOne({_id: req.params.id, creater: req.userData.userId}).then((result) => {
    if(result.n > 0){
      res.status(200).json({
        message: "Post Deleted Successfully!"
      });
    }else{
      res.status(401).json({
        message: "Authorization Failed!!"
      });
    }

  });


});

module.exports = Router;
