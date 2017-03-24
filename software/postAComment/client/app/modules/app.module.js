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
        'PAC.comments',
        'PAC.likes',
        'ngStorage',
        'PAC.footer'

    ]);
    console.log("in module")
}());