angular.module('itemEditCustomController', ['ui.bootstrap','translationService', 'dntServices'])
.controller('itemEditCustomCtrl',

['$scope','$timeout','dntData','hCodeValues','items','jobs','statHelper','exportLinkHelper','$routeParams','translations','$location','saveHelper',
function($scope,$timeout,dntData,hCodeValues,items,jobs,statHelper,exportLinkHelper,$routeParams,translations,$location,saveHelper) {
  'use strict';
  
  if(this.item.itemSource != 'custom') {
    return;
  }
  
  this.stat = {id:-1, name:''};
  this.newStatVal = 0;

  this.getStats = function() {
    return hCodeValues.stats;
  }
  
  this.newStat = function() {
    return {id:this.stat.id,max:this.newStatVal};
  }
  
  this.addStat = function() {
    if(this.stat.id > -1) {
      if(!this.item.stats) {
        this.item.stats = [];
      }
       
      this.item.stats.push(this.newStat());
      this.onChange();
    }
  }
  
  this.removeStat = function(stat) {
    var i = this.item.stats.indexOf(stat);
    if(i != -1) {
    	this.item.stats.splice(i, 1);
      this.onChange();
    }
  }
  
  this.getNewStatName = function() {
    return this.getStatName(this.newStat());
  }
  
  this.getNewStatDisplayValue = function() {
    return this.getStatDisplayValue(this.newStat());
  }
  
  this.getStatName = function(stat) {
    if(stat.id in hCodeValues.stats) {
      return hCodeValues.stats[stat.id].name;
    }
  }
  
  this.getStatDisplayValue = function(stat) {
    if(stat.id in hCodeValues.stats) {
      return hCodeValues.stats[stat.id].display(stat);
    }
  }
  
}])
.directive('dngearsimItemEditCustom', function() {
  return {
    scope: true,
    bindToController: {
      item: '=item',
      onChange: '&onChange',
    },
    controller: 'itemEditCustomCtrl',
    controllerAs: 'editCtrl',
    templateUrl: 'ui/item/item-edit-custom.html?bust=' + Math.random().toString(36).slice(2)
  };
});