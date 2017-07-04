

var app=angular.module('yiqituan',['ng','ngRoute']);

app.factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
    function($rootScope, $browser, $q, $exceptionHandler) {
        var deferreds = {},
            methods = {},
            uuid = 0;

        function debounce(fn, delay, invokeApply) {
            var deferred = $q.defer(),
                promise = deferred.promise,
                skipApply = (angular.isDefined(invokeApply) && !invokeApply),
                timeoutId, cleanup,
                methodId, bouncing = false;

            // check we dont have this method already registered
            angular.forEach(methods, function(value, key) {
                if (angular.equals(methods[key].fn, fn)) {
                    bouncing = true;
                    methodId = key;
                }
            });

            // not bouncing, then register new instance
            if (!bouncing) {
                methodId = uuid++;
                methods[methodId] = { fn: fn };
            } else {
                // clear the old timeout
                deferreds[methods[methodId].timeoutId].reject('bounced');
                $browser.defer.cancel(methods[methodId].timeoutId);
            }

            var debounced = function() {
                // actually executing? clean method bank
                delete methods[methodId];

                try {
                    deferred.resolve(fn());
                } catch (e) {
                    deferred.reject(e);
                    $exceptionHandler(e);
                }

                if (!skipApply) $rootScope.$apply();
            };

            timeoutId = $browser.defer(debounced, delay);

            // track id with method
            methods[methodId].timeoutId = timeoutId;

            cleanup = function(reason) {
                delete deferreds[promise.$$timeoutId];
            };

            promise.$$timeoutId = timeoutId;
            deferreds[timeoutId] = deferred;
            promise.then(cleanup, cleanup);

            return promise;
        }


        // similar to angular's $timeout cancel
        debounce.cancel = function(promise) {
            if (promise && promise.$$timeoutId in deferreds) {
                deferreds[promise.$$timeoutId].reject('canceled');
                return $browser.defer.cancel(promise.$$timeoutId);
            }
            return false;
        };

        return debounce;
    }
]);

app.config(function($routeProvider){
    $routeProvider.when('/start',{
        templateUrl:'tpl/start.html',
        controller:'satrtCtrl'
    }).when('/main',{
        templateUrl:'tpl/main.html',
        controller:'mainCtrl'
    }).when('/detail/:id',{
        templateUrl:'tpl/detail.html',
        controller:'detailCtrl'
    }).when('/order/:id',{
        templateUrl:'tpl/order.html',
        controller:'orderCtrl'
    }).when('/myorder',{
        templateUrl:'tpl/myorder.html',
        controller:'myorderCtrl'
    }).otherwise({
        redirectTo:'/start'
    })
});

app.controller('parentCtrl',['$scope','$location',function($scope,$location){
    $scope.jump=function(desPath){
        $location.path(desPath)
    }
}]);

app.controller('satrtCtrl',['$scope','$interval',function($scope,$interval){
    $scope.list=['l1.jpg','l2.jpg','l3.jpg','l4.jpg'];
    $scope.index=0;
    $interval(function(){
        $scope.index++;
        //console.log($scope.index);
        if($scope.index>3){
            $scope.index=0;
        }
    },1000);
}]);
app.controller('mainCtrl',['$scope','$http','$debounce',function($scope,$http,$debounce){
    //console.log('mainCtrl func is called');
    //定义一个布尔类型的标志位
    $scope.hasMore=true;

    $scope.kw='';

    var getData=function(){
        $http.get('data/dish_getbypage.php')
            .success(function(result){
                //console.log(result);
                $scope.dishList=result;
            })
            .error(function(){
                console.log(error);
            });
    };
    getData();

    $scope.loadMore=function(){
        $http.get('data/dish_getbypage.php?start='+$scope.dishList.length)
        .success(function(data){
                if(data.length<3){
                    $scope.hasMore=false;
                }
                //返回的新数组和之前拼接在一起
                $scope.dishList=$scope.dishList.concat(data);
            })
    };

    var hanlder=function(){
        $http.get('data/dish_getbykw.php?kw='+$scope.kw)
            .success(function(data){
                //console.log(data);
                if(data.length>0){
                    //将data数据显示在view中
                    $scope.dishList=data;
                    $scope.hasMore=false;
                }
            })
    };
    $scope.$watch('kw',function(){
        //console.log($scope.kw);
        if($scope.kw.length>0){
            $debounce(hanlder,300);
        }else{
            $http.get('data/dish_getbypage.php')
                .success(function(result){
                    //console.log(result);
                    $scope.dishList=result;
                    $scope.hasMore=true;
                })
                .error(function(){
                    console.log(error);
                });
        }

    });
}]);

app.controller('detailCtrl',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
    //console.log($routeParams);
    var did=$routeParams.id;
    $http.get('data/dish_getbyid.php?id='+did)
        .success(function(data){
            //console.log(data);
            $scope.dish=data[0];
        })
}]);

app.controller('orderCtrl',['$scope','$http','$routeParams','$httpParamSerializerJQLike',
    function($scope,$http,$routeParams,$httpParamSerializerJQLike){
    //console.log($routeParams);
    $scope.order={did:$routeParams.id};
    $scope.submitOrder=function(){
        console.log($scope.order);
        var result=$httpParamSerializerJQLike($scope.order);
        $http.get('data/order_add.php?'+result).success(function(data){
            console.log(data);
            if(data[0].msg='succ'){
                $scope.addResult='下单成功，订单编号为'+data[0].oid;
                sessionStorage.setItem('phone',$scope.order.phone)
            }else{
                $scope.addResult='下单失败';
            }
        })

    }
}]);

app.controller('myorderCtrl',['$scope','$http',function($scope,$http){
    var phone=sessionStorage.getItem('phone');
    $http.get('data/order_getbyphone.php?phone='+phone)
    .success(function(data){
            console.log(data);
            $scope.orderList=data;
        });
}]);