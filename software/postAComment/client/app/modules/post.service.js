/**
 * Created by purushotham on 20/3/17.
 */
//TODO: fix comment: This should go into post folder, This should not be in home folder of modules
(function() {
    'use strict'
    angular.module('PAC.home')
        .factory('postService', postService);
    postService.$inject = ['api', '$q'];
    function postService(api, q) {
        var setOfPostServices = {
            viewPosts : viewPosts,
            checkpost  : checkpost,
            addComment : addComment,
            addLikes : addLikes,
            removeLikes : removeLikes
        };
        return setOfPostServices;
        function viewPosts(q){
            var query=q;
            //TODO: fix comment: Remove all console logs
            //TODO: fix comment: You can reduce these line into single line
            console.log("in view posts service")
            return api.viewPosts({q : query}).$promise
        }
        function checkpost(id){
            var query=id;
            console.log("in view posts service")
            console.log(id)
            return api.checkpost({q : query}).$promise
        }
        function  addComment(q){
           var query=q;
            console.log("in view posts service addComment")
            console.log(query)
            return api.addComment({q : query}).$promise

        }
        function addLikes(q){
            var query=q;
            console.log("in view posts service addComment")
            console.log(query)
            return api.addLikes({q : query}).$promise

        }
        function removeLikes(q){
            var query=q;
            console.log("in view posts service removeLikes")
            console.log(query)
            return api.removeLikes({q : query}).$promise

        }
    }
}());