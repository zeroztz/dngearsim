angular.module('dnsim').controller('EquipmentCtrl',
['$scope','$window','dntData','hCodeValues','items','jobs','exportLinkHelper','$routeParams','translations','$location','region','itemFactory',
function($scope,$window,dntData,hCodeValues,items,jobs,exportLinkHelper,$routeParams,translations,$location,region,itemFactory) {
  'use strict';
  
  region.setLocationByName($routeParams.region);
  
  $window.scrollTo(0, 0);
  
  $scope.jobName = null;
  $scope.item = exportLinkHelper.decodeItem($routeParams.itemString);
  if('itemSource' in $scope.item) {
    $scope.itemType = items[$scope.item.itemSource];
  }
  
  $scope.item.setStats = null;
  $scope.item.setId = null;
  $scope.detail = null;
  
  $scope.getDescription = function() {
    if($scope.item.description) {
      return $scope.item.description;
    }
    else if($scope.itemType &&
      $scope.itemType.name == 'title' &&
      translations.isLoaded() &&
      dntData.isLoaded($scope.itemType.mainDnt)) {

      var itemData = dntData.find($scope.itemType.mainDnt, 'id', $scope.item.id);
      if(itemData && itemData.length > 0 && itemData[0].DescriptionID > 0) {
        return translations.translate(itemData[0].DescriptionID, itemData[0].DescriptionIDParam);
      }
    }
    return '';
  }
  
  $scope.getExchangeType = function() {
    // console.log('getting exchange');
    var exchangeDnt = 'exchange.lzjson';
    if(translations.isLoaded() &&
      dntData.isLoaded(exchangeDnt) &&
      $scope.item.exchangeType > 0) {
        
      // console.log('finding exchange ' + $scope.item.exchangeType);

      var exchange = dntData.find(exchangeDnt, 'ExchangeType', $scope.item.exchangeType);
      // console.log('got ' + exchange.length);
      if(exchange && exchange.length > 0 && exchange[0].NameID > 0) {
        // console.log('exchange name: ' + exchange[0].NameID);
        return translations.translate(exchange[0].NameID).toLowerCase();
      }
    }
    return '';
  }
  
  $scope.setDetail = function(detail) {
    $scope.detail = detail;
  }
  
  $scope.getServerStorage = function() {
    var itemData = itemFactory.getItemData($scope.item);
    if(itemData && 'AbleWStorage' in itemData && 'IsCash' in itemData && itemData.IsCash == 0) {
      if(itemData.AbleWStorage == 1) {
        return 'can put in server storage';
      }
      else if(itemData.AbleWStorage == 0) {
        return 'not transferable';
      }
    }
    return '';
  }
  
  $scope.handleChange = function() {
    $location.path('/item/' + region.dntLocation.region + '/' + exportLinkHelper.encodeItem($scope.item));
    $location.replace();
  }
  
  function getJobName() {
    var retVal = '';
    var allJobs = jobs.getAllJobs();
    angular.forEach(allJobs, function(job, index) {
      if(job.id == $scope.item.needJobClass) {
        $scope.jobName = job.name;
        return;
      }
    });
  }
  
  function init() {
    var anyToLoad = false;
    
    angular.forEach(exportLinkHelper.getDntFiles($scope.item), function(columns, fileName) {
      if(!dntData.isLoaded(fileName)) {
        dntData.init(fileName, columns, reportProgress, function() { tryInit() });
        anyToLoad = true;
      }
    });
    
    if(!translations.isLoaded()) {
      translations.init(reportProgress,function() { tryInit() });
      anyToLoad = true;
    }
    
    if(!jobs.isLoaded()) {
      jobs.init(reportProgress, function() { tryInit(); });
      anyToLoad = true;
    }
    
    if(!anyToLoad) {
      tryInit();
    }
  }
  init();
  
  function tryInit() {
    if(!dntData.anyLoading() && translations.isLoaded() && jobs.isLoaded()) {
      $scope.item = exportLinkHelper.reloadItem($scope.item);
      if($scope.item == null) {
        return;
      }
      
      setFullStats();
      $window.document.title = 'DN Gear Sim | ' + $scope.item.name;
      if($scope.item.itemSource != 'custom') {
      
        if($scope.item.typeName == 'skills') {
          if(!$scope.item.pve || $scope.item.pve != 'pvp') {
            $scope.item.pve = 'pve';
          }
          else {
            $scope.item.pve = 'pvp';
          }
        }
    
        if($scope.item.needJobClass > 0) {
          getJobName();
        }
      }
      
      var itemData = itemFactory.getItemData($scope.item);
      if(itemData.DisjointDrop1 > 0) {
        $scope.canExtract = true;
      }
      
      if((itemData.Type == 0 || itemData.Type == 1) && $scope.item.enchantmentNum > 0) {
        $scope.canTransfer = true;
      }
      
      if($scope.item.typeName != null) {
        $scope.canUse = true;
        $scope.detail = 'use';
      }
      else if($scope.item.typeId == 46 || $scope.item.typeId == 8) {
        $scope.hasContents = true;
        $scope.detail = 'contents';
      }
      else if($scope.canExtract) {
        $scope.detail = 'extract';
      }
      else if($scope.canTransfer) {
        $scope.detail = 'transfer';
      }
      else {
        $scope.detail = 'shops';
      }
    }
  }

  
  function setFullStats() {
    $scope.item.fullStats = $scope.item.stats;
    
    if($scope.item.enchantmentStats != null && $scope.item.enchantmentStats.length > 0) {
      $scope.item.fullStats = hCodeValues.mergeStats($scope.item.enchantmentStats, $scope.item.fullStats);
    }
    
    if($scope.item.sparkStats != null && $scope.item.sparkStats.length > 0) {
      $scope.item.fullStats = hCodeValues.mergeStats($scope.item.sparkStats, $scope.item.fullStats);
    }
  }
  
  function reportProgress(msg) {
    // $scope.progress += '|' + msg;
    // console.log('progress: ' + msg);
  }
}]);