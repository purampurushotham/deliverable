/**
 * Created by purushotham on 20/3/17.
 */
(function() {
    'use strict'
    angular.module("PAC")
        .factory("loadData", loadData);
    loadData.$inject = ['$http', '$q'];
    function loadData($http, $q) {

        return {
            getData: function () {
                console.log("in getData")
                var products = [];
                var deffered = $q.defer();
                //TODO: fix comment: You are not making use of app.resource.js file
                //Update it here..
                $http.get('/api/v1.0/posts').then(function mySuccess(response) {
                        deffered.resolve(response);
                }).then(function myError(error) {
                    deffered.reject("error in getting data");
                });
                return deffered.promise;
            }
        };
    }
}());