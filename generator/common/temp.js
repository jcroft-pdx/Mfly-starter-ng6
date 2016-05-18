import angular from 'angular';
import <%= name %>Component from './<%= name %>.component';

export default angular.module('<%= name %>', [
])

.component('<%= name %>', <%= name %>Component)
.service('<%= name %>Service', <%= name %>Service)
.name;
