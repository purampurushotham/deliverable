/**
 * Created by purushotham on 20/3/17.
 */
var mongoose = require("mongoose");
var Schema=mongoose.Schema
var schemaTypes=mongoose.Schema.Types
var commentSchema=new Schema({
     postId  : {
         type : schemaTypes.ObjectId,
         ref : 'posts',
         trim  : true
     },
    commentedBy : {
        type : String,
        trim  : true
    },
    commentedOn : {
        type : String,
        trim : true
    },
    text : {
        type : String,
        trim : true
    }
},
    {collection : 'comments'}
);
//TODO: fix comment: Model name should be in Caps and it should be singular
//var commentModel = mongoose.model('Comment',commentSchema);
//Update in all other models too..
var commentModel =mongoose.model('comments',commentSchema);
module.exports=commentModel;