/**
 * Created by purushotham on 20/3/17.
 */
/**
 * Created by purushotham on 2/3/17.
 */
(function() {
    'use strict';

    angular.module('PAC')

        .factory('api', api);

    api.$inject = ['$resource', '$rootScope'];

    function api ($resource, $rootScope) {
        return $resource('/', getParamDefaults(), getActions($rootScope));
    }
    var getParamDefaults = function () {
        return {
            id : '@id'
        };
    };
    var getActions = function() {
        return {
            'viewPosts': {
                method: "GET",
                url: "/api/v1.0/posts"
            },
            'checkpost': {
                method :"GET",
                url : "/api/v1.0/checkPost"
            }
        }
    }
}());