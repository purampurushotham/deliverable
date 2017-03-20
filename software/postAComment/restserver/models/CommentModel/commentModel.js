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
var commentModel =mongoose.model('comments',commentSchema);
module.exports=commentModel;