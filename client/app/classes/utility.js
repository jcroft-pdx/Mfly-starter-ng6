export default class {
  constructor () {
    "ngInject";
  }

  /**
   *  Trim long titles/descriptions to more manageable chunks.
   */
  trimText (str = '', length = 260) {
    if (str === null) {
      str = '';
    }

    if (str.length <= length) {
      return str;
    }
    else {
      str = str.substring(0, length) + '...';
      return str;
    }
  }

  /**
   * Sort an array... by things, with stuff, in ways.
   *
   * Flexible in ways that it probably shouldn't bother to, but it can take a
   * simple single property sort that will default to alpha ascending.
   *
   * Pass other types or orders to change the result against a single property.
   *
   * In the event that you need a fallback property to sort off of, keys can
   * be passed as an array of strings OR an array of objects... FUN.
   *
   * If keys is an array of strings, the properties will be searched in the
   * array for one that exists and is not null/empty. If it finds one it will
   * use it, in the order the keys are supplied. If one is not found, it will
   * just use the last one supplied so the function can continue to process.
   * The supplied type will be the method used for comparison against the
   * provided properties.
   *
   * If keys is an array of objects, the properties are searched as above, but
   * the remainder of the method logic will be altered based on the object. As
   * the object's key is the property to check, and the value is the type of
   * sort to perform.
   *
   * Order is currently static and is not affected by keys. Maybe later...
   */
  sortBy (array, keys = null, type = 'alpha', order = 'asc', ignorePrefix = false) {
    let key = null;

    // If we were provided an array of keys, try to find a useable one.
    if (Array.isArray(keys)) {
      // Loop through the supplied keys and try to find one that will sort the
      // provided array in some way.
      keyLoop: for (let i = 0; i < keys.length; i++) {

        let tempKey = keys[i];
        let tempProperty = '';
        let tempType = false;

        if (typeof tempKey === 'object') {
          tempProperty = Object.keys(tempKey)[0];
          tempType = tempKey[tempProperty];
        }
        else {
          tempProperty = tempKey;
        }

        // Loop through the supplied array to find a valid property based on the
        // current key.
        for (let j = 0; j < array.length; j++) {
          if (array[j].hasOwnProperty(tempProperty) && (array[j][tempProperty] !== null) && (array[j][tempProperty] !== '')) {
            // We found a key, set the key to it and stop processing.
            key = tempProperty;

            if (tempType) {
              type = tempType;
            }
            break keyLoop;
          }
        }
      }

      // If we didn't find a key, just use the last one.
      if (key === null) {
        key = keys.slice(-1)[0];
      }
    }
    // Otherwise just use the singular value as the key.
    else {
      key = keys;
    }

    // Do our sorting with the chosen key.
    return array.sort(
      (a, b) => {
        if (key !== null) {
          a = a[key];
          b = b[key];
        }

        switch (type) {
          case 'alpha':
            if (typeof a === 'undefined') {
              a = 'zzzzzz';
            }
            if (typeof b === 'undefined') {
              b = 'zzzzzz';
            }

            a = a.toLowerCase();
            b = b.toLowerCase();

            // Strip out the 'prefixes'.
            if (ignorePrefix) {
              // Only ignore the prefixes at the start of the string followed by a space.
              let re = new RegExp('^('+this._CONFIG.IGNORED_PREFIXES.join('|')+') +');
              a = a.replace(re, '');
              b = b.replace(re, '');
            }

            break;

          case 'date':
            a = new Date(a);
            b = new Date(b);

            if (!this.isValidDate(a)) {
              a = new Date(0);
            }
            if (!this.isValidDate(b)) {
              b = new Date(0);
            }
            break;
        }

        if (order === 'desc') {
          return a>b ? -1 : a<b ? 1 : 0;
        }
        else {
          return a<b ? -1 : a>b ? 1 : 0;
        }
      }
    );
  }

  /**
   * Takes an object and tests to see if it is a valid date.
   */
  isValidDate (d) {
    if (Object.prototype.toString.call(d) !== "[object Date]") {
      return false;
    }

    return !isNaN(d.getTime());
  }

  /**
   * Universal utility function to check touch features.
   */
  isTouch () {
    return 'ontouchstart' in window
      || navigator.maxTouchPoints;
  }
}
