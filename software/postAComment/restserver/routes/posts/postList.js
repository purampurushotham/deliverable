/**
 * Created by purushotham on 20/3/17.
 */
var posts=require('../../models/postModel/postModel');
var comments=require('../../models/CommentModel/commentModel')
var likes=require('../../models/LikeModel/likeModel')
var ObjectId = require('mongoose').Types.ObjectId;
var postsRoute= {
    viewPosts: function (req, res) {
        console.log("********* in view posts**********88")
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        console.log(queryParam)
        posts.find({}).sort(queryParam.sortingCriteria).skip(queryParam.page).limit(queryParam.page_size).exec(function (err, response) {
            if (err) {
                res.send(err);
            }
            else {
                posts.find({}).count().exec(function (err, result) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        console.log(response)
                        var posts = [];
                        for (var i = 0; i < response.length; i++) {
                            var p = {};
                            var e = response[i];
                            var localDate=new Date(e.postedOn)
                            localDate=localDate.toLocaleDateString().replace(/\//g,'-');
                            p.postedOn =localDate;
                            p.text = e.text;
                            p.postedBy = e.postedBy;
                            p.id=e._id;
                            posts.push(p);
                            console.log(posts)
                        }
                        res.send({data: posts, le: result})
                    }
                    ;
                });
            }
            ;
        });
    },
    checkpost : function (req,res) {
        console.log("********* in view posts**********88")
        var queryParam = req.query.q
        console.log(queryParam);
        posts.findOne({_id : queryParam}).populate('comments likes').exec(function(err,response){
            if(err){
                res.send(err)
            }
            else{
                console.log(response.comments)
                var a=response.comments.reverse();
                console.log(a)
                var localDate=new Date(response.postedOn);
                localDate=localDate.toLocaleDateString().replace(/\//g,'-');
                res.send({data : response,likes : response.likes,comments :a, date : localDate})
            }
        });
    },
    addComment : function (req,res) {
        console.log("********* in add comment**********88");
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        console.log(queryParam)
        var co={}
        co.postId=queryParam.id
        co.text=queryParam.comment;
        co.commentedBy=queryParam.commentedBy;
        co.commentedOn=queryParam.commentedon;
        var newComment=new comments(co);
        newComment.save(function (err,comment) {
            if(err){
                console.log(err)
            }
            else{
                console.log(comment);
                posts.findOne({_id : queryParam.id}).exec(function(err,response){
                    if(err){
                        res.send(err)
                    }
                    else if(response != null) {

                        if(!response.comments.includes(comment._id))
                            console.log(comment._id)
                        response.comments.push(comment._id)
                    }
                    response.save(function (err1,result) {
                        if(err1){
                            res.send(err1)
                        }
                        else{

                            console.log("****************** last query");
                            console.log(result)
                            res.send(result)
                        }
                    });
                });
            }
        });
    },
    addLikes : function (req,res) {
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        console.log(queryParam);
        var l={};
        l.postId = queryParam.id;
        l.likedBy=queryParam.likedBy;
        l.likedOn = queryParam.likedOn;
        console.log("************************************************************")
        console.log(l.likedOn)
        var newLikes=likes(l);
        newLikes.save(function (err,result){
            if(err){
                res.send(err)
            }
            else {
                posts.findOne({_id : queryParam.id}).exec(function(err1,response){
                    if(err1){
                        res.send(err1)
                    }
                    else if(response !=null){
                        if(!response.likes.includes(result._id)){
                            response.likes.push(result._id)
                        }
                        response.save(function(err2,actualResponse){
                            if(err2){
                                res.send(err);
                            }
                            else{
                                console.log(actualResponse)
                                res.send({data: {status : "ok"}})
                            }
                        });
                    }
                });
            }
        });

    },
    removeLikes : function(req,res){
        console.log("*******************************888")
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        console.log(queryParam);
        posts.findOne({_id : queryParam.id}).exec(function(err,response){
            if(err){
                res.send(err)
            }
            else if(response != null){
                likes.findOne({postId : new ObjectId(queryParam.id),likedBy : queryParam.likedBy}).exec(function(err1,li){
                    if(err1){
                        res.send(err1)
                    }
                    else if(likes!=null) {
                        console.log(li);
                        likes.remove({_id : li.id}).exec(function(err1){
                            if(err1)
                                res.send(err1)
                            else{
                                console.log("*********** after likes");
                                posts.findOneAndUpdate({_id: queryParam.id}, {$pull: {likes: {_id: li.id}}}, function(err2, data){
                                    if(err2){
                                        res.send(err2)
                                    }
                                    else {
                                        console.log("********************* after deleting")
                                        console.log(data);
                                        res.send({ de : {status : "ok"}})
                                    }

                                });
                            }
                        });
                    }
                })
            }
        });

    }
};
module.exports=postsRoute