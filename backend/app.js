const express = require('express');
const BodyParser = require('body-parser');

const app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));



app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
   "Origin, X-Requested-With, Content-Type, Accept");
   res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});


app.post("/api/posts", (req, res, next) => {
  const post = req.body;
 console.log(post);
 res.status(201).json({
   message: "Post Added Successfully"
 });
});

app.use("/api/posts",(req, res, next) => {

  posts = [
    {
      id: "sdgafgasfg",
      title: "First Server-side Post",
      content: "Hi I am from the server"
    },
    {
      id: "sdgasadfsfgasfg",
      title: "Second Server-side Post",
      content: "Hi I am from the server Again"
    }
  ];

  res.status(200).json({
       message: "Posts Fetched Successfully",
       posts: posts
  });
});


module.exports = app;
