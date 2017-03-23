/**
 * Created by purushotham on 20/3/17.
 */
//TODO: fix comment: Check the folder and model names those are inconsistent
var posts=require('../../models/postModel/postModel');
var comments=require('../../models/commentModel/commentModel')
//TODO: fix comment: Variable name should be Like
//Reason: you are creating object to LikeModel object, so if you have variable as Like then the coding will be improper to see.
var Like=require('../../models/LikeModel/likeModel')
var ObjectId = require('mongoose').Types.ObjectId;
var SuccessResponse =require('../../models/successResponse/SuccessResonse');
var ErrorResult =require('../../models/errorResult/ErrorResult');
var postsRoute= {
    viewPosts: function (req, res) {
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        //TODO: fix comment: Move this to any service js file
        //You need to check for null condition for all of these and then write a generic logic to do the below logic
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
                //TODO: fix comment: Variable names should be proper
                //TODO: fix comment: Why is this reverse function? If it is to get the recent comments first, then you can get the elements sort by desc order
                var a=response.comments.reverse();
                //TODO: fix comment: Why you are creating date object and send back to response? You should save the postedOn value as "Date" object in database
                // And while retrieving it'l be in date format itself, then in client side you can format it...
                var localDate=new Date(response.postedOn);
                localDate=localDate.toLocaleDateString().replace(/\//g,'-');
                //TODO: fix comment: The below logic should go into util method
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
        //TODO: fix comment: There should be util method to populate the query params object(Just like you did below), and call that method here.
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
        //TODO: fix comment: Proper variable names
        var l={};
        l.postId = queryParam.id;
        l.likedBy=queryParam.likedBy;
        l.likedOn = queryParam.likedOn;
        var newLikes=Like(l);
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
                //TODO: fix comment: else should be started after } paranthesis. i.e., } else ---> [Update everywhere]
                Like.findOne({postId : new ObjectId(queryParam.id),likedBy : queryParam.likedBy}).exec(function(err1,li){
                    if(err1){
                        return res.json(new ErrorResult("failed",err1,[{'msg' : 'likes not found'}]))
                    }
                    else if(likes!=null) {
                        Like.remove({_id : li.id}).exec(function(err1){
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