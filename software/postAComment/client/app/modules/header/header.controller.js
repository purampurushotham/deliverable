/**
 * Created by purushotham on 20/3/17.
 */
(function() {
    'use strict';
    angular.module('PAC.header')
        .component('headerComponent',{
            templateUrl : "app/partials/header.html",
            controller : headerCtrl,
            controllerAs : "hc"
        });
function headerCtrl() {
    var vm=this;
}
}());