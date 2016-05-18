export default class {
  constructor($scope, CONFIG, <%= name %>Service) {
    "ngInject";

    if (CONFIG.DEBUG) {
      function <%= upCaseName %>Tag() {}
      $scope.__tag = new <%= upCaseName %>Tag();
    }
  }
}
