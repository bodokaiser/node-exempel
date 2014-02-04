var util   = require('util');
var events = require('events');
var lodash = require('lodash');

var Model = require('./model');

function Collection(source) {
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
  this.models.push(model);

  this.emit('push', model);
  this.emit('change');

  return this;
};

Collection.prototype.remove = function(model) {
  lodash.remove(this.models, model);

  this.emit('remove', model);
  this.emit('change');

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
    model.once('remove', function() {
      collection.remove(model);
    });
  });
}
