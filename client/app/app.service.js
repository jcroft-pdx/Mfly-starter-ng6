export default class {
  constructor ($q, CONFIG) {
    "ngInject";

    // Localize injectables.
    this._$q = $q;
    this._CONFIG = CONFIG;

    // Initialize defaults.
    this._deviceType = mflyCommands.getDeviceType();
    this._interactiveInfo = null;
  }

  /**
   * This is the bootstrap for the app.
   *
   * Add any local methods that return a promise to this bootstrap to delay
   * processing.
   */
  bootstrap () {
    // Add any local methods that do inline processing here.


    // Add local methods that return promises to this array to add bootstrap
    // levels.
    let promises = [];

    // Only fetchInteractiveInfo if we're proxying through an interactive.
    if (this._CONFIG.MFLY_PROXY) {
      promises.push(
        this.fetchInteractiveInfo()
      );
    }

    return this._$q.all(promises);
  }

  /**
   * Returns cached interactive info.
   */
  get interactiveInfo () {
    return this._interactiveInfo;
  }

  /**
   * Returns cached device type.
   */
  get deviceType () {
    return this._deviceType;
  }

  /**
   * Are we in a dev environment or on a device? If DEBUG is one, we always get
   * true out of this. This is to make it easy to build/test functionality that
   * should only exist on device vs the web.
   */
  onDevice () {
    return (this._CONFIG.DEBUG || this._appService.deviceType !== 'web');
  }

  /**
   * Fetches interactive info from Mediafly. Returns a promise.
   */
  fetchInteractiveInfo () {
    let deferred = this._$q.defer();

    mflyCommands.getInteractiveInfo().then(
      (data) => {
        this._interactiveInfo = data;
        deferred.resolve(this._interactiveInfo);
      },
      () => {
        deferred.reject();
      }
    );

    return deferred.promise;
  }
}
