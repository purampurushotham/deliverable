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
            checkpost  : checkpost
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
    }
}());