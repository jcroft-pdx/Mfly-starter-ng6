export default class {
  constructor () {
    // This is the prefix we use to make Mediafly local data unique.
    this._dataPrefix = '';

    // Prefix words that should be ignored by the alpha sort.
    this._ignoredPrefixes = [ 'a', 'the' ];

    // Uses globals defined by Webpack.
    this._debug = DEBUG;
    this._showErrors = SHOW_ERRORS;
    this._mflyProxy = MFLY_PROXY;
  }

  get DEBUG () {
    return this._debug;
  }

  get SHOW_ERRORS () {
    return this._showErrors;
  }

  get MFLY_PROXY () {
    return this._mflyProxy;
  }

  get DATA_PREFIX () {
    return this._dataPrefix;
  }

  get IGNORED_PREFIXES () {
    return this._ignoredPrefixes;
  }
};
