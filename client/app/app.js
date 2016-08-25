'use strict';


import sessionService from 'app/services/sessionSrv'
import indexCtrl from 'app/controllers/index'
import loginCtrl from 'app/controllers/login'
import sidemenuCtrl from 'app/controllers/sidemenu'
import restrictedCtrl from 'app/controllers/restricted'
import user from 'app/directives/user'



const app = angular
    .module('myApp', [
        'ngMaterial',
        'ngAnimate',
        'ngRoute',
        'ngResource',
        'ngCookies',
        'formly',
        'formlyMaterial',
        'lbServices'
    ]).config(function (LoopBackResourceProvider) {

        // Use a custom auth header instead of the default 'Authorization'
        LoopBackResourceProvider.setAuthHeader('X-Access-Token');

        // Change the URL where to access the LoopBack REST API server
        LoopBackResourceProvider.setUrlBase('http://127.0.0.1:3000/api/');
    })
    .service('sessionService', sessionService)
    .controller('indexCtrl', indexCtrl)
    .controller('loginCtrl', loginCtrl)
    .controller('sidemenuCtrl', sidemenuCtrl)
    .controller('restrictedCtrl', restrictedCtrl)
    .directive('user', user);

export default app;

