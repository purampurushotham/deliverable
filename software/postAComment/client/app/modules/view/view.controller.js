/**
 * Created by purushotham on 20/3/17.
 */
(function(){
    'use strict';
    angular.module('PAC.view')
        .controller("viewCtrl",viewCtrl);
    viewCtrl.$inject=['$stateParams','$localStorage','homeService']
    function viewCtrl($stateParams,$localStorage,homeService){
        console.log("in view ctrl")
        console.log($localStorage.id)
        var vm=this;
        vm.id=$localStorage.id[$stateParams.id];
        console.log(vm.id)
        homeService.checkpost(vm.id).then(
            function (response){
                console.log(response)
                vm.comments=response.comments;
                vm.likes=response.likes;
                vm.post=response.data
                commentsCtrl(vm.comments)
            },
            function (failed) {
                console.log("failed")
            }
        );
        function commentsCtrl(comments) {
            console.log(comments)
            vm.comm=comments;
            vm.sam =vm.comm;
            vm.commentsSize = 2;
            vm.tempSize = vm.commentsSize;
            vm.viewMore = function () {
                if (vm.sam.length > vm.commentsSize) {
                    vm.commentsSize = (vm.commentsSize) + ((vm.sam  .length - 1) / 2);
                }
                else if (vm.sam.length < vm.commentsSize) {
                    vm.commentsSize = vm.sam.length;
                }
            }
            vm.hideButton = function () {
                if (angular.equals(vm.commentsSize, vm.sam.length)) {
                    return true;
                }
                else
                    return false;
            }

        }
    }

})();/**
 * Created by purushotham on 20/3/17.
 */
(function(){
    'use strict';
    angular.module('PAC.view')
        .controller("viewCtrl",viewCtrl);
    viewCtrl.$inject=['$stateParams','$localStorage','homeService']
    function viewCtrl($stateParams,$localStorage,homeService) {
        console.log("in view ctrl")
        console.log($localStorage.id)
        var vm = this;
        vm.id = $localStorage.id[$stateParams.id];
        console.log(vm.id)
        homeService.checkpost(vm.id).then(
            function (response) {
                console.log(response)
                vm.comments = response.comments;
                vm.likes = response.likes;
                vm.post = response.data
                commentsCtrl(vm.comments)
            },
            function (failed) {
                console.log("failed")
            }
        );
        function commentsCtrl(comments) {
            console.log(comments)
            vm.comm = comments;
            vm.sam = vm.comm;
            vm.commentsSize = 2;
            vm.tempSize = vm.commentsSize;
            vm.viewMore = function () {
                console.log("in view more")
                if (vm.sam.length > vm.commentsSize) {
                    vm.commentsSize = (vm.commentsSize) + ((vm.sam.length - 1) / 2);
                }
                else if (vm.sam.length < vm.commentsSize) {
                    vm.commentsSize = vm.sam.length;
                }
            }
            vm.hideButton = function () {
                if (angular.equals(vm.commentsSize, vm.sam.length)) {
                    vm.commentsSize = 2;
                }
            }
        }
        function addComments(comment) {
            homeService.addComment(comment)
        }
    }

})();