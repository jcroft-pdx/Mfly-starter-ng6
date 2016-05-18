import angular from 'angular';
import uiRouter from 'angular-ui-router';
import <%= name %>Component from './<%= name %>.component';

export default angular.module('<%= name %>', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";

  $stateProvider
    .state('<%= dashCaseName %>', {
      url: '/<%= dashCaseName %>',
      template: '<<%= dashCaseName %>></<%= dashCaseName %>>'
    });
})

.component('<%= name %>', <%= name %>Component)
.name;
