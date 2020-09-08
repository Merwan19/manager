angular.module('App').config(($stateProvider) => {
  $stateProvider.state('dedicatedClouds.users', {
    url: '/users',
    reloadOnSearch: false,
    views: {
      pccView: {
        templateUrl: 'dedicatedCloud/user/dedicatedCloud-user.html',
        controller: 'DedicatedCloudUserCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
});
