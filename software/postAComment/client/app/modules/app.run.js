/**
 * Created by purushotham on 20/3/17.
 */
(function(){
    'use strict';
    angular.module('PAC')
        .run(appRun);
    appRun.$inject=['loadData','$rootScope'];
    function appRun(loadData,$rootScope){
        console.log('in app.run');
       /* loadData.getData().then(
            function(response){
                console.log(response)
                $rootScope.posts=[];
                $rootScope.posts=response.data;
                console.log('in Success')
            }
            ,function (failure) {
                console.log('in failure')
            }

        )*/
    }
}());