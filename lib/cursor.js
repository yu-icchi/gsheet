'use strict';

class Cursor {

  constructor(items) {
    this.items = items;
  }

  toArray(callback) {
    callback(null, this.items);
  }

  forEach(iterator, callback) {
    
  }
}

module.exports = Cursor;
