export default class {
  constructor($scope, CONFIG) {
    "ngInject";

    if (CONFIG.DEBUG) {
      function <%= upCaseName %>Tag() {}
      $scope.__tag = new <%= upCaseName %>Tag();
    }
  }
}
