var util   = require('util');
var events = require('events');
var lodash = require('lodash');

var Model = require('./model');

function Collection(source) {
  this.length = 0;

  listenToPushEvent(this);

  setupModels(source, this);

  events.EventEmitter.call(this);
}

util.inherits(Collection, events.EventEmitter);

Collection.prototype.at = function(index) {
  return this.models[index];
};

Collection.prototype.has = function(uniqueId) {
  return !!lodash.find(this.models, {
    id: uniqueId
  });
};

Collection.prototype.get = function(uniqueId) {
  return lodash.find(this.models, {
    id: uniqueId
  });
};

Collection.prototype.push = function(model) {
  this.length = this.models.push(model);

  this.emit('push', model);
  this.emit('change');

  return this;
};

Collection.prototype.remove = function(model) {
  this.length = this.length - lodash.remove(this.models, model).length;

  this.emit('remove', model);
  this.emit('change');

  model.removeAllListeners('change');

  return this;
};

Collection.prototype.forEach = function(callback) {
  lodash.forEach(this.models, callback);

  return this;
};

Collection.prototype.toJSON = function() {
  return lodash.map(this.models, function(model) {
    return model.toJSON();
  });
};

module.exports = Collection;

function setupModels(source, collection) {
  collection.models = [];

  if (lodash.isArray(source)) {
    source.forEach(function(model) {
      if (collection.Model) {
        model = new collection.Model(model);
      } else {
        model = new Model(model);
      }

      collection.push(model);
    });
  }
}

function listenToPushEvent(collection) {
  collection.on('push', function(model) {
    model.on('change', function() {
      collection.emit('change', model);
    });
    model.once('remove', function() {
      collection.remove(model);
    });
  });
}
