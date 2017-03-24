/**
 * Created by purushotham on 20/3/17.
 */
//TODO: fix comment: Check the folder and model names those are inconsistent
var postModel=require('../../models/postModel/postModel');
var commentModel=require('../../models/commentModel/commentModel')
var appUtils=require('../../utils/app.utils')
//TODO: fix comment: Variable name should be Like
//Reason: you are creating object to LikeModel object, so if you have variable as Like then the coding will be improper to see.
var LikeModel=require('../../models/LikeModel/likeModel')
var ObjectId = require('mongoose').Types.ObjectId;
var SuccessResponse =require('../../models/successResponse/SuccessResonse');
var ErrorResult =require('../../models/errorResult/ErrorResult');
var postsRoute= {
    viewPosts: function (req, res) {
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        //TODO: fix comment: Move this to any service js file
        //You need to check for null condition for all of these and then write a generic logic to do the below logic
        postModel.find({}).sort(queryParam.sortingCriteria).skip(queryParam.page).limit(queryParam.page_size).exec(function (err, response) {
            if (err) {
                res.send(err);
            }
            else {
                postModel.find({}).count().exec(function (err, result) {
                    if (err) {
                        return res.json(new ErrorResult("failed","data not found",[{'msg' : 'error message'}]));
                    }
                    else {
                        var posts = [];
                        for (var i = 0; i < response.length; i++) {
                            var post  = {};
                            var eachpost = response[i];
                            post.postedOn =new Date(eachpost.postedOn).toLocaleDateString();
                            post.text = eachpost.text;
                            post.postedBy = eachpost.postedBy;
                            post.id=eachpost._id;
                            posts.push(post);
                            var pagination={};
                            pagination.total=result;
                        }
                        res.send(new SuccessResponse("ok",posts,pagination,'Success'))
                    }

                });
            }
        });
    },
    checkpost : function (req,res) {
        var queryParam = req.query.q;
        postModel.findOne({_id : queryParam}).populate({path :'comments likes',options : {sort : {'comments.commentedOn' : -1}}})
            .exec(function(err,response){
                if(err){
                    return res.json(new ErrorResult("failed",err,[{'msg' :'error' }]))
                }
                else {
                    //TODO: fix comment: Variable names should be proper
                    //FIXED
                    //TODO: fix comment: Why is this reverse function? If it is to get the recent comments first, then you can get the elements sort by desc order
                    console.log("****** reverse comments")
                    console.log(response)
                    //TODO: fix comment: Why you are creating date object and send back to response? You should save the postedOn value as "Date" object in database
                    //FIXED
                    // And while retrieving it'l be in date format itself, then in client side you can format it...
                    //TODO: fix comment: The below logic should go into util method
                    //FIXED
                    var post=appUtils.getPostResponse(response);
                    res.send(new SuccessResponse("ok",post,'','Success'))
                }
            });
    },
    addComment : function (req,res) {
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        //TODO: fix comment: There should be util method to populate the query params object(Just like you did below), and call that method here.
        //FIXED
        //calling util service to get comment params
        var eachComment=appUtils.getCommentParams(queryParam)
        var newComment=new commentModel(eachComment);
        newComment.save(function (err,comment) {
            if(err){
                return res.json(new ErrorResult("failed",err,[{'msg' : 'error'}]))
            }
            else{
                postModel.findOne({_id : queryParam.id}).exec(function(err1,response){
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
        //FIXED
        //calling util service to set querparam object
        var eachLike=appUtils.getLikesParams(queryParam)
        var newLikes=LikeModel(eachLike);
        newLikes.save(function (err,result){
            if(err){
                return res.json(new ErrorResult("failed",err,[{'msg' : 'likes not updated'}]))
            }else {
                postModel.findOne({_id : queryParam.id}).exec(function(err1,response){
                    if(err1){
                        return res.json(new ErrorResult("failed",err1,[{'msg' : 'post not found'}]))
                    }else if(response !=null){
                        if(!response.likes.includes(result._id)){
                            response.likes.push(result._id)
                        }
                        response.save(function(err2,actualResponse){
                            if(err2){
                                return res.json(new ErrorResult("failed",err2,[{'msg' : 'likes not updated in posts'}]))
                            }else{
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
        postModel.findOne({_id : queryParam.id}).exec(function(err,response){
            if(err){
                return res.json(new ErrorResult("failed",err,[{'msg' : 'post not found'}]))
            }else if(response != null){
                //TODO: fix comment: else should be started after } paranthesis. i.e., } else ---> [Update everywhere]
                //FIXED
                LikeModel.findOne({postId : new ObjectId(queryParam.id),likedBy : queryParam.likedBy}).exec(function(err1,eachLike){
                    if(err1){
                        return res.json(new ErrorResult("failed",err1,[{'msg' : 'likes not found'}]))
                    }else if(eachLike!=null) {
                        LikeModel.remove({_id : eachLike.id}).exec(function(err1){
                            if(err1) {
                                res.send(err1)
                            }else {
                                  postModel.findOneAndUpdate({_id: queryParam.id}, {$pull: {likes: {_id: eachLike.id}}}, function(err2, data){
                                    if(err2){
                                        return res.json(new ErrorResult("failed",err2,[{'msg' : 'likes not updated in posts'}]))
                                    }else {
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