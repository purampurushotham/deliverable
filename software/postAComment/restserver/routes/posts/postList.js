/**
 * Created by purushotham on 20/3/17.
 */
var posts=require('../../models/postModel/postModel')
var postsRoute= {

    viewPosts: function (req, res) {
        console.log("********* in view posts**********88")
        var queryParam = (req.query && req.query.q) ? JSON.parse(req.query.q) : req.body.q;
        console.log(queryParam)
        posts.find({}).skip(queryParam.page).limit(queryParam.page_size).exec(function (err, response) {
            if (err) {
                res.send(err);
            }
            else {
                posts.find({}).count().exec(function (err, result) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        console.log(response)
                        var posts = [];
                        for (var i = 0; i < response.length; i++) {

                            var p = {};
                            var e = response[i];
                            p.postedOn = e.postedOn;
                            p.text = e.text;
                            p.postedBy = e.postedBy;
                            p.id=e._id
                            posts.push(p);
                            console.log(posts)
                        }
                        res.send({data: posts, le: result})
                    }
                    ;
                });
            }
            ;
        });
    },
    checkpost : function (req,res) {
        console.log("********* in view posts**********88")
        var queryParam = req.query.q
        console.log(queryParam);
       // var populateQuery = [{path:'comments'}, {path:'likes'}];
        posts.findOne({_id : queryParam.id}).populate('comments').exec(function(err,response){
           if(err){
               res.send(err)
           }
            else{
               console.log(response);
           }
        });
    }
}
module.exports=postsRoute