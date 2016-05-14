import angular from 'angular';

// External Libraries.
import FastClick from 'fastclick';
import uiRouter from 'angular-ui-router';

// External CSS.
import 'normalize.css';

// Application Components.
import Components from './components/components';

// This Component.
import AppComponent from './app.component';

// Global services.
import AppService from './app.service';
import Config from './app.config';
import Utility from './classes/utility';

angular.module('app', [
    uiRouter,
    Components
  ])
  .config(($compileProvider, $provide) => {
    "ngInject";

    if (!ANGULAR_DEBUG) {
      // Disable this for performance.
      $compileProvider.debugInfoEnabled(false);
    }

    // add mfly protocol to whitelist
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|mfly):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|mfly):/);

    $provide.decorator("$exceptionHandler", function($delegate, $injector){
      return function(exception, cause){
        var $rootScope = $injector.get("$rootScope");

        $rootScope.$broadcast('error', {
          message: "Exception",
          reason: exception
        });
        $delegate(exception, cause);
      };
    });
  })

  .service('CONFIG', Config)
  .service('utility', Utility)
  .service('appService', AppService)
  .component('app', AppComponent)
  .run(($window) => {
    "ngInject";

    FastClick.attach(document.body);
    $window.unhandledResume = false;
  });
