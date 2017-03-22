
(function(){
    'use strict'
    angular.module('PAC.home')
        .controller('homeCtrl',homeCtrl);
    homeCtrl.$inject=['$rootScope','NgTableParams','postService','$filter','$localStorage','$state'];
    function homeCtrl($rootScope,NgTableParams,postService,$filter,$localStorage,$state) {
        var vm = this;
        loadTable();
        function loadTable() {
            vm.exists=true;
            vm.tableParams = new NgTableParams({
                page: 1,
                count: 10

            }, {

                counts: [2, 5, 10, 25, 50, 100],
                getData: function (params) {
                    var query = {
                        page_size: params.count() === -1 ? 0 : params.count(),
                        page: (params.page() - 1) * params.count(),
                        sortingCriteria: params.sorting()
                    };
                    return postService.viewPosts(query).then(function (response) {
                        if(response.status =='ok') {
                            vm.userTable = response.data;
                            params.total(response.pagination.total);
                            $localStorage.id = [];
                            for (var i = 0; i < response.data.length; i++) {
                                $localStorage.id.push(response.data[i].id)
                            }
                            var filterObj = params.filter(), filteredData = $filter('filter')(vm.userTable, filterObj);
                            checkTable(filteredData);
                            var sortObj = params.sorting(), orderedData = $filter('orderBy')(filteredData, filterObj);
                            var data = orderedData;
                            return data;
                        }
                    });
                }

            });
        }
        function checkTable(filteredData) {
            if( filteredData.length == 0){
               vm.exists=false;

            }

        }
    }
})();
