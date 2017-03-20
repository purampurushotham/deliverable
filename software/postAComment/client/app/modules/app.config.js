/**
 * Created by purushotham on 20/3/17.
 */
(function(){
    'use strict';
    angular.module('PAC')
        .config(appConfig);
    appConfig.$inject=['$stateProvider','$urlRouterProvider']
    function appConfig($stateProvider,$urlRouterProvider){
        console.log("in app.config")
        $urlRouterProvider.otherwise('Home');
        $stateProvider
            .state('Home',{
                url : "/Home",
                templateUrl  :"app/partials/home.html",
                controller : 'homeCtrl',
                controllerAs : 'hm'
            })
            .state('view',{
                url : "/view",
                templateUrl  :"app/partials/view.html",
                controller : 'view',
                controllerAs : 'vc'
            });
    }
}());