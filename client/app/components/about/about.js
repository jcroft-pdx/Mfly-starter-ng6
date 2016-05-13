import angular from 'angular';
import uiRouter from 'angular-ui-router';
import aboutComponent from './about.component';

export default angular.module('about', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('about', {
      url: '/about',
      template: '<about></about>'
    });
})

.component('about', aboutComponent);
