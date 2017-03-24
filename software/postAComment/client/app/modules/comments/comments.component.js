/**
 * Created by purushotham on 24/3/17.
 */
/**
 */
(function () {
    'use strict'
    angular.module('PAC.comments')
        .component('commentComponent',{
        templateUrl : "app/partials/comment.html",
        controller : commentCtrl,
        controllerAs : "cc",
        bindings : {
            sam : "=",
            id : '=',
            check : '&'
        }
    });
    commentCtrl.$inject=['postService']
    function commentCtrl(postService) {
        var vm = this;
        vm.$onInit = function () {
            vm.viewPost = vm.check;
            vm.commentDate = {
                value: new Date()

            };
            vm.comm = vm.sam;
            vm.sam = vm.comm;
            vm.commentsSize = 2;
            vm.tempSize = vm.commentsSize;
            console.log(vm.sam)
            vm.addComment = function (comment, commBy, commOn) {
                vm.check();
                var json = JSON.stringify(commOn);
                commOn = commOn.toISOString();
                var query = {};
                query.id = vm.id;
                query.comment = comment;
                query.commentedBy = commBy
                query.commentedon = commOn;
                postService.addComment(query).then(
                    function (response) {
                        if (response.status == "ok")
                            vm.check()
                    },
                    function (failed) {
                    }
                );
            }
            //TODO: fix comment: What does the below two lines of code
            //display comments with initial size 2
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
    }


}());