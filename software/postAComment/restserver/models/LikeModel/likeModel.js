/**
 * Created by purushotham on 20/3/17.
 */
var mongoose = require("mongoose");
var Schema=mongoose.Schema
var schemaTypes=mongoose.Schema.Types
var likesSchema = new Schema({
     postId : {
         type : schemaTypes.ObjectId,
         trim : true
     } ,
    likedOn : {
        type : Date,
        trim : true
    },
    likedBy : {
        type : String,
        trim : true
    }
},
    {collection : 'likes'}
);
var likesModel = mongoose.model("likes",likesSchema);
module.exports=likesModel