import angular from 'angular';
import <%= name %>Component from './<%= name %>.component';
import <%= name %>Service from './<%= name %>.service';

export default angular.module('<%= name %>', [
])

.component('<%= name %>', <%= name %>Component)
.service('<%= name %>Service', <%= name %>Service)
.name;
