/**
 * Created by purushotham on 20/3/17.
 */
(function(){
    'use strict'
    angular.module('PAC',[
        'ui.router',
        'ngTable',
        'ui.bootstrap',
        'ngResource',
        'PAC.header',
        'PAC.home',
        'PAC.view',
        'ngStorage'
    ]);
    console.log("in module")
}());