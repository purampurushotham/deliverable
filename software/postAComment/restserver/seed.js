var async = require('async');
var mongoose =require('mongoose')
var posts=require('./models/postModel/postModel')
var comments=require('./models/CommentModel/commentModel')
var likes=require('./models/LikeModel/likeModel')
var dateFormat=require('dateformat');
var moment=require('moment')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/postAComment');
var mydb=mongoose.connection;
var Q=require('q');
var fs=require('fs');
var contents=fs.readFileSync('../client/data.json')
var jsonContents=JSON.parse(contents)
for(var i=0;i<jsonContents.length;i++){
    insert(jsonContents[i]);
}
function insert(eachObject){
    var p=new posts();
    p.text=eachObject.text;
    p.postedBy=eachObject.postedBy;
    //TODO: fix comment: Format should be used globally, by retrieving from constants.js file.
    //So This format converter should go into util method and use global format from constants.js file
    //Reason: Different countries will use different formats. So according to the country the format should be changed dynamically and globally..
    var date = moment(eachObject.postedOn.toString(), 'DD/MM/YYYY');
    var formatedDate = date.format('MM/DD/YYYY');
    var formatedIso = dateFormat(formatedDate, "isoDateTime");
    //TODO: fix comment: No need of isoDateTime format conversion. Simply save date.
    //Eg: p.postedOn = new Date(eachObject.postedOn)
    //Update in all other places
    p.postedOn=formatedIso;
    p.comments=[];
    p.likes=[];
    var promises=[];
    eachObject.comments.forEach(function (eachComment){
        promises.push(insertComments(p,eachComment));
    });
    eachObject.likes.forEach(function (eachLike){
        promises.push(insertLikes(p,eachLike))
    });
    Q.allSettled( promises ).then(function (resp) {
        p.save(function (err) {
            if (err) {
            }
            else {
            }
        });
    });
}
function insertComments(p,eachComment){
    var newComment ={};
    var deffered = Q.defer();
    newComment.commentedBy = eachComment.commentedBy;
    newComment.text = eachComment.text;
    newComment.postId=p._id;
    var date = moment(eachComment.commentedOn.toString(), 'DD/MM/YYYY');
    var formatedDate = date.format('MM/DD/YYYY');
    var formatedIso = dateFormat(formatedDate, "isoDateTime");
    newComment.commentedOn = formatedIso;
    var comment = comments(newComment);
    comment.save(function (err) {
        if (err) {
            deffered.reject("rejected");
        }
        else {
            p.comments.push(comment._id);
            deffered.resolve();
        }
    });
    return deffered.promise;
}

function insertLikes(p,eachLike){
    var newLike ={};
    var deffered = Q.defer();
    newLike.postId=p._id;
    newLike.postId=p._id;
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
            p.likes.push(like._id);
            deffered.resolve();
        }
    });
    return deffered.promise;
}