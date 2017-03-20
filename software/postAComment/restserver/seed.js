/**
 * Created by purushotham on 20/3/17.
 */
var async = require('async');
var mongoose =require('mongoose')
var posts=require('./models/postModel/postModel')
var comments=require('./models/CommentModel/commentModel')
var likes=require('./models/LikeModel/likeModel')
var dateFormat=require('dateformat');
var moment=require('moment')
mongoose.connect('mongodb://localhost/postAComment');
var mydb=mongoose.connection;
var Q=require('q');
var fs=require('fs');
var contents=fs.readFileSync('../client/data.json')
var jsonContents=JSON.parse(contents)
console.log(jsonContents.length)
for(var i=0;i<jsonContents.length;i++){
   insert(jsonContents[i]);
}
mydb.close();
function insert(eachObject){
    var p=[];
    p.text=eachObject.text;
    p.postedBy=eachObject.postedBy;
    var date = moment(eachObject.postedOn.toString(), 'DD/MM/YYYY');
    var formatedDate = date.format('MM/DD/YYYY');
    var formatedIso = dateFormat(formatedDate, "isoDateTime");
    p.postedOn=formatedIso;
    p.comments=[];
    p.likes=[];
    var promises=[];
    eachObject.comments.forEach(function (eachComment){
        console.log("in comments")
        promises.push(insertComments(p,eachComment));
    })
    eachObject.likes.forEach(function (eachLike){
            promises.push(insertLikes(p,eachLike))
    })
    Q.allSettled( promises ).then(function (resp) {
        var po = posts(p);
        po.save(function (err) {
            if (err) {

            }
            else {
                console.log("data Loaded");
            }
        });
    });
}
function insertComments(p,eachComment){
    console.log("comments ibnsertion");
var newComment ={};
var deffered = Q.defer();
newComment.commentedBy = eachComment.commentedBy;
newComment.text = eachComment.text;
var date = moment(eachComment.commentedOn.toString(), 'DD/MM/YYYY');
var formatedDate = date.format('MM/DD/YYYY');
var formatedIso = dateFormat(formatedDate, "isoDateTime");
newComment.commentedOn = formatedIso;
var comment = comments(newComment);
//p.push(eachProduct);
comment.save(function (err) {
    if (err) {
        deffered.reject("rejected");
    }
    else {
        console.log("comments");
        p.comments.push(comment._id);
        deffered.resolve();
    }
});
return deffered.promise;
}

function insertLikes(p,eachLike){
    var newLike ={};
    var deffered = Q.defer();
    newLike.likedBy = eachLike.likedBy;
    var date = moment(eachLike.likedOn.toString(), 'DD/MM/YYYY');
    var formatedDate = date.format('MM/DD/YYYY');
    var formatedIso = dateFormat(formatedDate, "isoDateTime");
    newLike.likedOn = formatedIso;
    var like = likes(newLike);
//p.push(eachProduct);
    like.save(function (err) {
        if (err) {
            deffered.reject("rejected");
        }
        else {
            console.log("likes");
            p.likes.push(like._id);
            deffered.resolve();
        }
    });
    return deffered.promise;
}
