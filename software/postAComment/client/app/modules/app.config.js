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
        $urlRouterProvider.otherwise('home');
        $stateProvider
            .state('home',{
                url : "/home",
                templateUrl  :"app/partials/home.html",
                controller : 'homeCtrl',
                controllerAs : 'hm'
            })
            .state('view',{
                url : "/view/:id",
                templateUrl  :"app/partials/view.html",
                controller : 'viewCtrl',
                controllerAs : 'vc'
            });
    }
}());