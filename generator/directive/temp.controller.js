export default class {
  constructor($element, $scope, CONFIG) {
    "ngInject";

    if (CONFIG.DEBUG) {
      function <%= upCaseName %>Tag() {}
      $scope.__tag = new <%= upCaseName %>Tag();
    }
  }
}
