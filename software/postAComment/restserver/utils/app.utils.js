/**
 * Created by purushotham on 24/3/17.
 */
var mongoose=require('mongoose')
var appUtils={
    getQuery : function(req){
        return (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
    },
    getLikesParams: function(query){
        var like={};
        like.postId = query.id;
        like.likedBy=query.likedBy;
        like.likedOn = query.likedOn;
        return like;
    },
    getCommentParams : function(query){
        console.log(query)
        var comment={}
        comment.postId=query.id
        comment.text=query.comment;
        comment.commentedBy=query.commentedBy;
        comment.commentedOn=query.commentedon;
        return comment;

    },
    getPostResponse : function(response){
        var post={}
        var a=response.comments.reverse();
        post.po=response;
        post.likes=response.likes;
        post.comments=a;
        return post;
    }
}
module.exports=appUtils