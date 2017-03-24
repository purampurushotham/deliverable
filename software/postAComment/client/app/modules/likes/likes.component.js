/**
 * Created by purushotham on 24/3/17.
 */
/**
 * Created by purushotham on 24/3/17.
 */
(function () {
    'use strict';
    angular.module('PAC.likes')
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


}())