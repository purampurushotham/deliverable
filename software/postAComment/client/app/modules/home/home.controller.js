
(function(){
    'use strict'
    angular.module('PAC.home')
        .controller('homeCtrl',homeCtrl);
    homeCtrl.$inject=['$rootScope','NgTableParams','homeService','$filter','$localStorage','$state'];
    function homeCtrl($rootScope,NgTableParams,homeService,$filter,$localStorage,$state) {
        var vm = this;
        console.log("in home controler");
        loadTable();
        function loadTable() {
            vm.tableParams = new NgTableParams({
                page: 1,
                count: 3

            }, {

                counts: [2, 5, 10, 25, 50, 100],
                getData: function (params) {
                    var query = {
                        page_size: params.count() === -1 ? 0 : params.count(),
                        page: (params.page() - 1) * params.count(),
                        id: vm.id,
                        sortingCriteria: params.sorting()
                    }
                    return homeService.viewPosts(query).then(function (response) {
                        /*//params.total(data.inlineCount); // recal. page nav controls*/
                        console.log(response)
                        vm.userTable = response.data;
                        params.total(response.le);
                        $localStorage.id = [];
                        for (var i = 0; i < response.data.length; i++) {
                            $localStorage.id.push(response.data[i].id)
                        }
                        var filterObj = params.filter(), filteredData = $filter('filter')(vm.userTable, filterObj);
                        var sortObj = params.sorting(), orderedData = $filter('orderBy')(filteredData, filterObj);
                        var data = orderedData;
                        return data;
                    });
                }

            });
        }
    }
})();
