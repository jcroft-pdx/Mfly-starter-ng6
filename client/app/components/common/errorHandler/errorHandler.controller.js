export default class {
  constructor($rootScope, $timeout, CONFIG) {
    "ngInject";

    this.errorMessage = false;

    if (CONFIG.SHOW_ERRORS) {
      this.errorMessages = [];

      $rootScope.$on('$stateChangeStart', () => {
        this.errorMessage = false;
        this.errorMessages = [];
      });

      $rootScope.$on('error', (e, error) => {
        $timeout(() => {
          this.errorMessage = true;
          this.errorMessages.push(error);
        });
      });
    }
  }
}
