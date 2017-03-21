/**
 * Created by purushotham on 20/3/17.
 */
(function(){
    'use strict';
    angular.module('PAC.view')
        .controller("viewCtrl",viewCtrl);
    viewCtrl.$inject=['$stateParams','$localStorage','postService','$filter'];
    function viewCtrl($stateParams,$localStorage,postService,$filter){
        var vm=this;
        vm.i=0;
        vm.commentDate={
            value : new Date()
        };
        var hasLiked = false;
        vm.id=$localStorage.id[$stateParams.id];
        checkpost();
        function checkpost() {
            console.log("in checkPost")
            postService.checkpost(vm.id).then(
                function (response) {
                    console.log(response)
                    vm.comments = response.comments;
                    vm.likes = response.likes;
                    vm.le=vm.likes.length;
                    vm.post = response.data;
                    vm.date=response.date;
                    convertDates()
                    comments(vm.comments)
                },
                function (failed) {
                    console.log("failed")
                }
            );
        }
        function convertDates(){
            vm.comments.forEach(function(eachDate){
                var localDate=new Date(eachDate.commentedOn);
                localDate=localDate.toLocaleDateString().replace(/\//g,'-');
                eachDate.commentedOn =localDate;
            });
        }
        function comments(comments) {
            vm.comm = comments;
            vm.sam = vm.comm;
            vm.commentsSize = 2;
            vm.tempSize = vm.commentsSize;
            vm.viewMore = function () {
                if (vm.sam.length > vm.commentsSize) {
                    vm.commentsSize = (vm.commentsSize) + 2;
                }
                else if (vm.sam.length < vm.commentsSize) {
                    vm.commentsSize = vm.sam.length;
                }
            };
            vm.hideButton = function () {
                if (angular.equals(vm.commentsSize, vm.sam.length)) {
                    vm.commentsSize = 2;
                }
            }
        }
        vm.addComment=function(comment,commBy,commOn){
            console.log("in add Comment")
            var json = JSON.stringify(commOn);
            var id=vm.post._id;
            commOn=commOn.toISOString();
            var query={}
            query.id=vm.post._id;
            query.comment=comment;
            query.commentedBy=commBy
            query.commentedon=commOn;
            console.log(query.commentedon)
            postService.addComment(query).then(
                function (response){
                    checkpost();
                },
                function (failed) {
                    console.log("failed")
                }
            );
        }
        vm.addLikes=function () {
            var query={};
            query.id=vm.id;
            query.likedBy="newsty"
            var d=new Date();
            query.likedOn=d.toISOString();
            if (!hasLiked) {
                hasLiked = true;
                vm.liked = 'Unlike';
                vm.likeCount += 1;
                postService.addLikes(query).then(
                    function (response) {
                        console.log(response);
                        checkpost();
                    },
                    function (failed) {
                        console.log("failed")
                    }
                );
            }
            else {
                hasLiked = false;
                vm.liked = 'Like';
                vm.likeCount -= 1;
                postService.removeLikes(query).then(
                    function (response) {
                        console.log(response);
                        checkpost();
                    },
                    function (failed) {
                        console.log("failed")
                    }
                );
            }
        };
    }

})();
