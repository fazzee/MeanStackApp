const Post = require('../models/post');


exports.createPost = (req, res, next) => {
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
 }).catch(err => {
   res.status(501).json({
     message: "Creating a Post Failed"
   });
 });

};

exports.updatePost = (req, res, next) =>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creater: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creater: req.userData.userId }, post).then(result => {
    if(result.n > 0){
      res.status(200).json({
        message: "Update Successful!"
      });
    }else{
      res.status(401).json({
        message: "Authorization Failed!!"
      });
    }
  }).catch(err =>{
    res.status(501).json({
      message: "Post Update Failed"
    });
  });
};



exports.getPosts = (req, res, next) => {
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
  }).catch(err => {
    res.status(501).json({
      message: "Posts Fetching Failed Reload Application"
    });
  });
};


exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post =>{
       if(post){
         res.status(200).json(post);
       }else{
         res.status(404).json({message: "Post Not Found"});
       }
  }).catch(err => {
    res.status(500).json({
      message: "Post Fetching Failed Try Reloading the Application"
    });
  });
};



exports.deletePost = (req, res, next) => {

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

  }).catch(err => {
    res.status(501).json({
      message: "Post Deletion Failed"
    });
  });


};












