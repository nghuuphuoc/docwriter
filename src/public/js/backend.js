angular.module('app.admin',    []);
angular.module('app.category', []);
angular.module('app.post',     ['ngSanitize']);
angular.module('app.user',     []);

angular
    .module('app', [
        'ngRoute',

        'angular-loading-bar',
        'angularFileUpload',
        'angularMoment',
        'btford.socket-io',
        'growlNotifications',
        'ui.bootstrap',
        'ui.codemirror',
        'ui.gravatar',

        // App modules
        'app.admin',
        'app.category',
        'app.post',
        'app.user'
    ])
    .constant('API', {
        baseUrl: ''
    })
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    // Use lodash
    .constant('_', window._)
    .constant('marked', window.marked)
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider

            // admin module
            .when('/admin', {
                templateUrl: '/js/admin/views/dashboard.html',
                controller: 'DashboardCtrl',
                data: {
                    requiredAuthentication: true
                }
            })

            // category module
            .when('/admin/category', {
                templateUrl: '/js/category/views/index.html',
                controller: 'CategoryCtrl',
                data: {
                    requiredAuthentication: true
                }
            })
            .when('/admin/category/add', {
                templateUrl: '/js/category/views/add.html',
                controller: 'AddCategoryCtrl',
                data: {
                    requiredAuthentication: true
                }
            })
            .when('/admin/category/edit/:id', {
                templateUrl: '/js/category/views/edit.html',
                controller: 'EditCategoryCtrl',
                data: {
                    requiredAuthentication: true
                }
            })

            // post module
            .when('/admin/post', {
                templateUrl: '/js/post/views/index.html',
                controller: 'PostCtrl',
                data: {
                    requiredAuthentication: true
                }
            })
            .when('/admin/post/edit/:id', {
                templateUrl: '/js/post/views/edit.html',
                controller: 'EditPostCtrl',
                data: {
                    requiredAuthentication: true
                }
            })
            .when('/admin/post/add', {
                templateUrl: '/js/post/views/add.html',
                controller: 'AddPostCtrl',
                data: {
                    requiredAuthentication: true
                }
            })

            // user module
            .when('/admin/user', {
                templateUrl: '/js/user/views/index.html',
                controller: 'UserCtrl',
                data: {
                    requiredAuthentication: true
                }
            })
            .when('/admin/user/password', {
                templateUrl: '/js/user/views/password.html',
                controller: 'UserPasswordCtrl',
                data: {
                    requiredAuthentication: true
                }
            })
            .when('/admin/user/add', {
                templateUrl: '/js/user/views/add.html',
                controller: 'AddUserCtrl',
                data: {
                    requiredAuthentication: true
                }
            })
            .when('/admin/user/edit/:id', {
                templateUrl: '/js/user/views/edit.html',
                controller: 'EditUserCtrl',
                data: {
                    requiredAuthentication: true
                }
            });

        $locationProvider.html5Mode(true);
    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }])
    .factory('socket', function(socketFactory) {
        return socketFactory();
    })
    .run(['$rootScope', 'AUTH_EVENTS', 'AuthService', function($rootScope, AUTH_EVENTS, AuthService) {
        $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
            if (nextRoute !== null && nextRoute.data && nextRoute.data.requiredAuthentication && !AuthService.isAuthenticated) {
                // User isn't logged in yet
                event.preventDefault();
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        });
    }]);
