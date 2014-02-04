var util   = require('util');
var events = require('events');
var lodash = require('lodash');

function Model(source) {
  setupAttributes(source, this);

  events.EventEmitter.call(this);
}

util.inherits(Model, events.EventEmitter);

Model.prototype.has = function(key) {
  return lodash.has(this.attributes, key);
};

Model.prototype.get = function(key) {
  return this.attributes[key];
};

Model.prototype.set = function(key, value) {
  if (lodash.isPlainObject(key)) {
    lodash.forIn(key, function(value, key) {
      this.set(key, value);
    }, this);
  }
  if (lodash.isString(key)) {
    this.attributes[key] = value;

    this.emit('change:' + key, value);
    this.emit('change', key, value);
  }

  return this;
};

Model.prototype.remove = function() {
  this.emit('remove');

  return this;
};

Model.prototype.toJSON = function() {
  return lodash.cloneDeep(this.attributes);
};

module.exports = Model;

function setupAttributes(source, model) {
  model.id = lodash.uniqueId();
  model.attributes = {};

  lodash.merge(model.attributes, source);
}
