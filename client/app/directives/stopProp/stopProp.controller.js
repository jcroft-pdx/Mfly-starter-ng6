export default class {
  constructor ($element, $scope, $attrs, CONFIG) {
    "ngInject";

    if (CONFIG.DEBUG) {
      function StopPropTag() {}
      $scope.__tag = new StopPropTag();
    }

    let events = '';

    switch ($attrs.stopProp) {
      case 'click':
        events = 'click';
        break;

      case 'all':
      default:
        events = 'click touchstart touchdrag';
    }

    $element.on(events, function (e) {
      e.stopPropagation();
    });

    $scope.$on('$destroy', () => {
      $element.off;
    });
  }
}
