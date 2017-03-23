/**
 * Created by purushotham on 20/3/17.
 */
//TODO: fix comment: Messy code...You should not merge all components together into a single file
//Each component should have separate file for it. File name should match with the component name
(function(){
    'use strict';
    angular.module('PAC.view')
        .controller("viewCtrl",viewCtrl)
        .component('commentComponent',{
            templateUrl : "app/partials/comment.html",
            controller : commentCtrl,
            controllerAs : "cc",
            bindings : {
                sam : "=",
                id : '=',
                check : '&'
            }
        })
        .component('likesComponent',{
            templateUrl : "app/partials/likes.html",
            controller : likesCtrl,
            controllerAs : "lc",
            bindings : {
                likes: "=",
                id : '=',
                check : '&'
            }
        });
    viewCtrl.$inject=['$stateParams','$localStorage','postService','$filter'];
    function viewCtrl($stateParams,$localStorage,postService,$filter) {
        var vm = this;
        vm.i = 0;
        var hasLiked = false;
        vm.id = $localStorage.id[$stateParams.id];
        vm.checkpost =  function () {
            postService.checkpost(vm.id).then(
                function (response) {
                    if(response.status == "ok"){
                        vm.comments = response.data.comments;
                        vm.likes = response.data.likes;
                        vm.post = response.data.po;
                        vm.date = response.data.date;
                        convertDates()
                        // comments(vm.comments)
                    }
                },
                function (failed) {

                }
            );
        }
        vm.checkpost();
        function convertDates() {
            vm.comments.forEach(function (eachDate) {
                var localDate = new Date(eachDate.commentedOn);
                localDate = localDate.toLocaleDateString().replace(/\//g, '-');
                eachDate.commentedOn = localDate;
            });
        }
    }
    commentCtrl.$inject=['postService']
    function commentCtrl(postService) {
        var vm=this;
        vm.$onInit =function() {
            vm.viewPost = vm.check;
            vm.commentDate = {
                value: new Date()

            };

            vm.addComment=function(comment,commBy,commOn){
                vm.check();
                var json = JSON.stringify(commOn);
                commOn=commOn.toISOString();
                var query={};
                query.id=vm.id;
                query.comment=comment;
                query.commentedBy=commBy
                query.commentedon=commOn;
                postService.addComment(query).then(
                    function (response){
                        if(response.status =="ok")
                        vm.check()
                    },
                    function (failed) {
                    }
                );
            }
        }
        //TODO: fix comment: What does the below two lines of code
            vm.comm = vm.sam;
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
            };
    }
    likesCtrl.$inject=['postService']
    function likesCtrl(postService){
        var hasLiked = false;
        var vm = this;
        vm.$onInit = function () {
            vm.addLikes=function () {
                var query = {};
                query.id = vm.id;
                query.likedBy = "newsty"
                var d = new Date();
                query.likedOn = d.toISOString();
                if (!hasLiked) {
                    hasLiked = true;
                    vm.liked = 'Unlike';
                    vm.likeCount += 1;
                    postService.addLikes(query).then(
                        function (response) {
                            vm.check();
                        },
                        function (failed) {
                        }
                    );
                }
                else {
                    hasLiked = false;
                    vm.liked = 'Like';
                    vm.likeCount -= 1;
                    postService.removeLikes(query).then(
                        function (response) {
                            vm.check();
                        },
                        function (failed) {
                        }
                    );
                }
            };
        }
    }




})();
