angular.module('setupController', ['translationService', 'dntServices','ngRoute'])
.controller('SetupCtrl', 
  ['$scope','$route','$routeParams','$timeout','translations','dntInit','dntReset',
   function($scope, $route, $routeParams, $timeout, translations, dntInit, dntReset) {
  
  var noLocation = '';
  var sessionLocation = $routeParams.location;
  if(sessionLocation == null) {
    sessionLocation = noLocation;
  }
  
  $scope.location = sessionLocation;
  if($scope.location == noLocation) {
    $scope.testResults = ['No location set'];
  }
  else {
    $scope.testResults = ['Using location ' + $scope.location];
  }
  
  $scope.hostedFiles = [
    {region: 'na', name: 'nov15', url : 'https://spacedb.firebaseapp.com/nov15'},
    {region: 'na', name: 'latest', url : 'https://spacedb.firebaseapp.com/latest'}
    ];
    
  
  $scope.resetSessionData = function() {
    $scope.testResults = ['session data reset.. reloading page'];
    sessionStorage.clear();
    this.saveLocation();
    $timeout(function() { location.reload(true); });
  }
  
  function progress(msg) {
    $timeout(
      function() {
        if($scope.testResults != null) {
          $scope.testResults.push(msg);
        }
      });
  }
  
  function translationsComplete() {
    dntInit(progress);
  }
  
  $scope.saveLocation = function() {
    translations.reset();
    dntReset(progress);
    if($scope.location != noLocation) {
      var params = $routeParams;
      params['location'] = $scope.location;
      $route.updateParams(params);
      $scope.testResults = [
        'Location saved',
        'Using location ' + $scope.location];
    }
  }
  
  $scope.testLocation = function() {
    if($scope.location != noLocation) {
      $scope.testResults = [
        'Using location ' + $scope.location,
        'Loading all data used by the app'];
      translations.init(progress, translationsComplete);
    }
  }
}]);
