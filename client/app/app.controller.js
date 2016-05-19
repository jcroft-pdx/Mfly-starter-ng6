export default class {
  constructor ($scope, $window, appService, utility) {
    "ngInject";

    // Localize injectables.
    this._appService = appService;

    // This value halts execution of the rest of the application through a not
    // so clever ng-if.
    this.bootstrapped = false;

    if (!utility.isTouch()) {
      $('body').addClass('no-touch');
    }

    // Runs any processes that are important to the app initializing. Blocks
    // rendering of the entire application.
    appService.bootstrap().then(() => {
      this.bootstrapped = true;
    });

    $scope.$on('$stateChangeStart', () => {

    });

    $scope.$on('$stateChangeSuccess', () => {

    });

    $scope.$watch(
      () => $window.unhandledResume,
      (resumed) => {
        if (resumed) {
          // Add any functions that should be called when the app is resumed.

          // The unhandled resume has been handled.
          $window.unhandledResume = false;
        }
      }
    );
  }
}
