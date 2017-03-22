/**
 * Created by purushotham on 20/3/17.
 */
var posts=require('../../models/postModel/postModel');
var comments=require('../../models/CommentModel/commentModel')
var likes=require('../../models/LikeModel/likeModel')
var ObjectId = require('mongoose').Types.ObjectId;
var SuccessResponse =require('../../models/successResponse/SuccessResonse');
var ErrorResult =require('../../models/errorResult/ErrorResult');
var postsRoute= {
    viewPosts: function (req, res) {
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        posts.find({}).sort(queryParam.sortingCriteria).skip(queryParam.page).limit(queryParam.page_size).exec(function (err, response) {
            if (err) {
                res.send(err);
            }
            else {
                posts.find({}).count().exec(function (err, result) {
                    if (err) {
                        return res.json(new ErrorResult("failed","data not found",[{'msg' : 'error message'}]));
                    }
                    else {
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
                            var pagination={};
                            pagination.total=result;
                        }
                        res.send(new SuccessResponse("ok",posts,pagination,'Success'))
                    }
                    ;
                });
            }
            ;
        });
    },
    checkpost : function (req,res) {
        var queryParam = req.query.q
        posts.findOne({_id : queryParam}).populate('comments likes').exec(function(err,response){
            if(err){
               return res.json(new ErrorResult("failed",err,[{'msg' :'error' }]))
            }
            else {
                var a=response.comments.reverse();
                var localDate=new Date(response.postedOn);
                localDate=localDate.toLocaleDateString().replace(/\//g,'-');
                var post={}
                post.po=response;
                post.likes=response.likes;
                post.comments=a;
                post.date=localDate
                res.send(new SuccessResponse("ok",post,'','Success'))
            }
        });
    },
    addComment : function (req,res) {
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        var co={}
        co.postId=queryParam.id
        co.text=queryParam.comment;
        co.commentedBy=queryParam.commentedBy;
        co.commentedOn=queryParam.commentedon;
        var newComment=new comments(co);
        newComment.save(function (err,comment) {
            if(err){
                return res.json(new ErrorResult("failed",err,[{'msg' : 'error'}]))
            }
            else{
                posts.findOne({_id : queryParam.id}).exec(function(err1,response){
                    if(err1){
                        return res.json(new ErrorResult("failed",err1,[{'msg' : 'post not found'}]))
                    }
                    else if(response != null) {

                        if(!response.comments.includes(comment._id))
                        response.comments.push(comment._id)
                    }
                    response.save(function (err2,result) {
                        if(err2){
                            return res.json(new ErrorResult("failed",err2,[{'msg' : 'comment not updated'}]))
                        }
                        else{
                            res.send(new SuccessResponse("ok",'','','Success'))
                        }
                    });
                });
            }
        });
    },
    addLikes : function (req,res) {
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        var l={};
        l.postId = queryParam.id;
        l.likedBy=queryParam.likedBy;
        l.likedOn = queryParam.likedOn;
        var newLikes=likes(l);
        newLikes.save(function (err,result){
            if(err){
                return res.json(new ErrorResult("failed",err,[{'msg' : 'likes not updated'}]))
            }
            else {
                posts.findOne({_id : queryParam.id}).exec(function(err1,response){
                    if(err1){
                        return res.json(new ErrorResult("failed",err1,[{'msg' : 'post not found'}]))
                    }
                    else if(response !=null){
                        if(!response.likes.includes(result._id)){
                            response.likes.push(result._id)
                        }
                        response.save(function(err2,actualResponse){
                            if(err2){
                                return res.json(new ErrorResult("failed",err2,[{'msg' : 'likes not updated in posts'}]))
                            }
                            else{
                                res.send(new SuccessResponse("ok",'','','Success'))
                            }
                        });
                    }
                });
            }
        });

    },
    removeLikes : function(req,res){
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        posts.findOne({_id : queryParam.id}).exec(function(err,response){
            if(err){
                return res.json(new ErrorResult("failed",err,[{'msg' : 'post not found'}]))
            }
            else if(response != null){
                likes.findOne({postId : new ObjectId(queryParam.id),likedBy : queryParam.likedBy}).exec(function(err1,li){
                    if(err1){
                        return res.json(new ErrorResult("failed",err1,[{'msg' : 'likes not found'}]))
                    }
                    else if(likes!=null) {
                        likes.remove({_id : li.id}).exec(function(err1){
                            if(err1)
                                res.send(err1)
                            else{
                                posts.findOneAndUpdate({_id: queryParam.id}, {$pull: {likes: {_id: li.id}}}, function(err2, data){
                                    if(err2){
                                        return res.json(new ErrorResult("failed",err2,[{'msg' : 'likes not updated in posts'}]))
                                    }
                                    else {
                                        res.send(new SuccessResponse("ok",'','','Success'))
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
module.exports=postsRoute;