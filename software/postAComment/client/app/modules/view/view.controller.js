/**
 * Created by purushotham on 20/3/17.
 */
//TODO: fix comment: Messy code...You should not merge all components together into a single file
//Each component should have separate file for it. File name should match with the component name
(function(){
    'use strict';
    angular.module('PAC.view')
        .controller("viewCtrl",viewCtrl)
    viewCtrl.$inject=['$stateParams','$localStorage','postService','$filter'];
    function viewCtrl($stateParams,$localStorage,postService,$filter) {
        var vm = this;
        vm.i = 0;
        var hasLiked = false;
        vm.id = $localStorage.id[$stateParams.id];
        vm.checkpost =  function () {
            postService.checkpost(vm.id).then(
                function (response) {
                    console.log(response)
                    if(response.status == "ok"){
                        vm.comments = response.data.comments;
                        vm.likes = response.data.likes;
                        vm.post = response.data.po;
                        vm.post.postedOn=new Date(response.data.po.postedOn).toLocaleDateString();
                        vm.date = response.data.date;
                        convertDates()
                        // comments(vm.comments)
                    }
                },
                function (failed) {

                }
            );
        }
        vm.checkpost();
        function convertDates() {
            vm.comments.forEach(function (eachDate) {
               eachDate.commentedOn = new Date(eachDate.commentedOn).toLocaleDateString();
            });
        }
    }
   //moved commentctrl and likesctrl to seperate components


})();
