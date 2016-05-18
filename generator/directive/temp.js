import angular from 'angular';
import <%= name %>Directive from './<%= name %>.directive';

export default angular.module('<%= name %>', [
])

.directive('<%= name %>', <%= name %>Directive)
.name;
