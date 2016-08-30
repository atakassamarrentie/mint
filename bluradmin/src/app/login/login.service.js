(function () {
    'use strict';

    app
        .service('sessionSerivce', sessionSerivce);

    /** @ngInject */
    function sessionSerivce($rootScope, $cookies, User) {
        $cookies.put('loginstate',false)
        $rootScope.loginAllow = function(state){
            $rootScope.loginState = state
        }

        this.logout = function() {
            User.logout({ access_token: this.token }).$promise.then(
                function(res){
                    this.token = null
                    $cookies.remove('token')
                    $cookies.remove('user')
                },
                function(err){ this.error = err }
            )
        }

        this.login = function(username, password){
            User.login({ username: username, password: password }).$promise.then(
                function(res){
                    this.response = res
                    this.error = null
                    this.token = res.id
                    this.user = res.user
                    $cookies.put('token', res.id)
                    $cookies.putObject('user', res.user)
                },
                function(err) {
                    this.error = err
                    this.response = null
                }
            )
        }

    }

})();