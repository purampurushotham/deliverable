var express = require('express');
/*var router = express.Router();*/
var path = require('path');
var posts = require("./posts/postList");
/* GET home page. */
var appRoutes=function(app) {
  app.get('/api/v1.0/posts', posts.viewPosts);
  app.get('/api/v1.0/checkPost', posts.checkpost);
  app.post('/api/v1.0/addComment',posts.addComment);
  app.post('/api/v1.0/addLikes',posts.addLikes);
  app.delete('/api/v1.0/removeLikes',posts.removeLikes);

}
module.exports = appRoutes;
