import Config from '../app.config';

export default class {
  constructor ($q, CONFIG) {
    "ngInject";

    this._$q = $q;

    this.appPrefix = CONFIG.DATA_PREFIX;
  }

  getItem (id) {
    let deferred = this._$q.defer();

    mflyCommands.getItem(id).then(
      (data) => {
        deferred.resolve(data);
      },
      () => {
        deferred.reject();
      }
    );

    return deferred.promise;
  }

  getFolder (id) {
    let deferred = this._$q.defer();

    mflyCommands.getFolder(id).then(
      (data) => {
        deferred.resolve(data);
      },
      () => {
        deferred.reject();
      }
    );

    return deferred.promise;
  }

  /**
   * Recursively grabs a folder hierarchy.
   *
   * The provided model is populated with a flat object of the entire structure
   * of the filesystem from the root folder down. Any folders are populated with
   * an items property containing an array of its children.
   *
   * @param string id
   *   The id of the folder to start with.
   * @param object model
   *   The property to populate with the folder's items.
   * @param bool root
   *   Tells the method if we're at the beginning of the hierarchy.
   */
  getFolderRecursive (id, model, root = true, folderFilters = false) {
    if (root === true) {
      return this.getItem(id).then(
        (result) => {
          model[result.id] = result;

          return this.getFolderRecursive(id, model, false, folderFilters);
        }
      );
    }
    else {
      return this.getFolder(id).then(
        (result) => {
          var defer = this._$q.defer();
          var promises = [];
          var items = [];

          if (angular.isArray(result)) {
            var i,ilen = result.length;

            for (i = 0; i < ilen; i++) {
              var item = result[i];

              items.push(item.id);
              model[item.id] = item;

              if (item.type === 'folder') {
                // Now check for filters passed in.
                if (folderFilters) {
                  // Loop over properties in filters object.
                  for (let k in folderFilters) {
                    // Loop over acceptable values for given property.
                    for (let i in folderFilters[k]) {
                      // If the item has the property and is the acceptable value, continue recursion.
                      if (item.hasOwnProperty(k) && item[k].toLowerCase() === folderFilters[k][i].toLowerCase()) {
                        promises.push(this.getFolderRecursive(item.id, model, false, folderFilters));
                      }
                    }
                  }
                }
                // If the filters object is empty, go ahead and continue.
                else {
                  promises.push(this.getFolderRecursive(item.id, model, false, folderFilters));
                }
              }
            }

            model[id].items = items;

            return this._$q.all(promises).then(
              (data) => {
                defer.resolve();
              },
              () => {
                defer.reject();
              }
            );
          }
        }
      );
    }
  }

  /**
   * Flexible data creation method.
   *
   * @param string type
   *   The type of data we're creating, should be formatted like '|a|',
   *   where 'a' is the prefix for the type of data.
   * @param string name
   *   The name property for the item we're creating.
   * @param object obj
   *   The data about the item to be saved, should be a javascript object.
   * @param string id
   *   A custom ID to use instead of allowing one to be created.
   *
   * @private
   */
  _create (type, name = '', obj = {}, id = null) {
    // If we didn't get a type, stop processing.
    if (typeof type === "undefined") {
      return false;
    }

    // Get a date.
    let d = new Date();
    let createDate = d.toISOString();

    // If no id supplied, generate one based on the date.
    if (typeof id === "undefined" || id === null) {
      id = d.getTime();  // ms since 1970
    }

    // Build a unique key for this item.
    let key = this.appPrefix + type + id;

    // Populate the data object.
    let data = {};
    data.id = '' + id; // convert to string
    data.name = name;
    data.createdDate = createDate;
    data.modifiedDate = createDate;
    data.objData = obj;
    data = angular.toJson(data);

    return mflyCommands.putValue(key, data)
      .then((result, status) => {
        return data;
      });
  };

  /**
   * Returns an item from the user's local device storage.
   *
   * @param string type
   *   The type of item to find.
   * @param string id
   *   The id of the item to return.
   *
   * @return promise
   *   The promise success passes an object containing the data.
   *
   * @private
   */
  _read (type, id = '') {
    let key = this.appPrefix + type + id;

    return mflyCommands.getValue(key)
      .then((data, status) => {
        let obj = {};

        if (this._isJsonString(data)) {
          obj = angular.fromJson(data);
        }
        return obj;
      });
  };

  /**
   * Returns multiple items of a type from the user's local device storage.
   *
   * @param string type
   *   The type of item to find.
   * @param boolean fullObject
   *   Optional boolean to tell the function to return the complete objects
   *   instead of the minimal id/named/pinned default that we use for lists.
   *
   * @return promise
   *   The promise success passes an object containing the data.
   *
   * @private
   */
  _readMultiple (type, fullObject = true) {
    let key = this.appPrefix + type;

    return mflyCommands.getValues(key)
      .then((data, status) => {
        // Input is the mediafly format.
        // Converts to an array of objects with only name and id properties.
        let resultsArray = [];
        angular.forEach(data, (item) => {
          // Item is text at this point so we need to parse it.
          if (this._isJsonString(item)) {
            let obj = angular.fromJson(item);
            // Deleted accounts will be empty.
            if (obj.hasOwnProperty('id')) {
              // If the full object has been requested, push it as is.
              if (fullObject === true) {
                resultsArray.push(obj);
              }
              // Otherwise return our smaller list style output.
              else {
                // Build a new object.
                let newObj = {};
                newObj.id = obj.id;
                newObj.name = obj.name;

                // Push our new object into the array.
                resultsArray.push(newObj);
              }
            }
          }
        });
        return resultsArray;
      });
  };

  /**
   * Modifies the saved values for an item.
   *
   * @param string type
   *   The type of the item to modify.
   * @param string id
   *   The id of the item to modify.
   * @param string name
   *   The new name for the item.
   * @param object obj
   *   The data for the item.
   *
   * @return promise
   *   The promise success passes the id of the item that was modified.
   *
   * @private
   */
  _update (type, id, name = '', obj = {}) {
    let key = this.appPrefix + type + id;

    return mflyCommands.getValue(key)
      .then((data, status) => {

        let newData = angular.fromJson(data);

        newData.modifiedDate = new Date().toISOString();
        newData.name = name;
        newData.objData = obj;

        return newData;
      })
      .then((item) => {
        item = angular.toJson(item);

        return mflyCommands.putValue(key, item)
          .then((data, status) => {
            return id;
          });
      });
  }

  /**
   * Flexible data deletion method.
   *
   * @param string id
   *   The id of the item to delete.
   *
   * @return promise
   *   The promise success passes the id of the item deleted.
   *
   * @private
   */
  _delete (type, id) {
    let key = this.appPrefix + type + id;

    return mflyCommands.deleteKey(key)
      .then((status) => {
        return id;
      });
  }

  /**
   * Helper function to make sure we're only processing valid JSON.
   *
   * @param string str
   *   The json string to check.
   *
   * @return boolean
   *
   * @private
   */
  _isJsonString (str) {
    try {
      angular.fromJson(str);
    } catch (e) {
      return false;
    }
    return true;
  };

}
