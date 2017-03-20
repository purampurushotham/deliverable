/**
 * Created by purushotham on 20/3/17.
 */
var mongoose = require("mongoose");
var Schema=mongoose.Schema
var schemaTypes=mongoose.Schema.Types
var postSchema=new Schema({
    text: {
        type: String,
        trim: true
    },
    postedBy: {
        type: String,
        trim: true
    },
    postedOn: {
        type: Date,
        trim: true,
        default: Date.now()
    },
    comments: [{
        type: schemaTypes.ObjectId,
        ref: 'comments',
        trim: true
    }],
    likes: [{
        type: schemaTypes.ObjectId,
        ref: "likes",
        trim: true

    }],
},

    {collection : "posts"}
);
var postsModel = mongoose.model('posts',postSchema);
module.exports=postsModel;