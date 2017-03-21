/**
 * Created by purushotham on 20/3/17.
 */
(function() {
    'use strict'
    angular.module('PAC.home')
        .factory('homeService', homeService);
    homeService.$inject = ['api', '$q'];
    function homeService(api, q) {
        var setOfHomeServices = {
            viewPosts : viewPosts,
            checkpost  : checkpost,
            addComment : addComment,
            addLikes : addLikes,
            removeLikes : removeLikes
        };
        return setOfHomeServices;
        function viewPosts(q){
            var query=q;
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