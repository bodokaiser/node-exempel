# exempel

Lean [Backbone](http://backbonejs.org) like Model and Collection for
browserify.

Benefits:
- easy integration into you View, Router stack
- easy integration to your persistence flow (just listen to "change")
- small code base (at least when you let uglifify clean up lodash)

## Installation

Install with [npm(1)](http://npmjs.org):

    $ npm install --save exempel

## Preview

The basic idea is to have an extendable prototype which carries state
you can share between different views. The reason why I did not use any
existing library for this is that other libraries have a complete
different model approach (e.g. scheme based) or are just too heavy.

### Model

The `Model` prototype represents a single entity.

```
var util    = require('util');
var exempel = require('exempel');

function Product(source) {
  exempel.Model.call(this, source);

  this.isInternal = 'property';
  this.attributes.isA = 'real model property';

  listenToChangeEvent(this);
}

util.inherits(Product, exempel.Model);

Product.prototype.addComment = function(comment) {
  this.get('comments').push(comment);

  return this;
};

// will cache this model on change
// into the browsers session storage
function listenToChangeEvent(model) {
  model.on('change', function(key, value) {
    var source = JSON.stringify(model);

    sessionStorage.setItem('product', source);
  });
}
```

#### new Model([source])

Sets up a new `Model` instance with `source` as attributes. Will also
generate a unique id on `model.id`. The `Model` itself inherits from
`events.EventEmitter`.

#### Event: "change"

Emitted when you change a model attribute with `set()`. However as
`Object.observe` is still experimental there is currently no way to
observe properties without using a setter.

#### Event: "change:<key>"

Each time you set a property next to the "change" event there will be
another event "change:<key>" where "<key>" will be the property name.
This is useful if you want to listen to the change of a specific
property.

#### Event: "remove"

Emitted when you call `model.remove()`. This is actually for use with a
`collection` so we know when to remove a model from array.

#### model.has(key)

Returns `true` if model has property `key`.

#### model.get(key)

Returns value behind property `key`.

#### model.set(source)

Merges `source` onto `model.attributes`.

#### model.set(key, value)

Sets `value` on `model.attributes[key]`.

#### model.remove()

Will emit an "remove" event for listening collections.

#### model.toJSON()

Returns deep clone of `model.attributes`.

### Collection

The `Collection` prototype represents a collection of entities.

```
var util    = require('util');
var ldoash  = require('lodash');
var exempel = require('exempel');

function Products(source) {
  // if you do not specify Model it will use
  // the default Model
  this.Model = Product;

  exempel.Collection.call(this, source);
}

util.inherits(Products, exempel.Collection);

Products.prototype.find = function(query) {
  return lodash.find(this.models, {
    attributes: query
  });
};
```

#### new Collection([source])

Creates a new instance of `Collection` with pushing all items in
`source` to `collection.models`. Also inherits from
`events.EventEmitter`.

#### Event: "push"

Emitted when a model is added to collection. Will also be emitted by
`new Collection()` when mapping source.

```
collection.on('push', function(model) {
  // add model to list element
}};
collection.push(model);
```

#### Event: "remove"

Emitted when a model is removed from collection.

```
collection.on('remove', function(model) {
  // remove model from list element
  // note that it is wiser to just let the view
  // instance listen on the models "remove" event
  // then you do not have to query the right li from list view
}};
collection.remove(model);
```

#### Event: "change"

Emitted on when collection changes by "push" or "remove". Can be used if
you want to do a `PUT` on change. For example:

```
collection.on('change', function() {
  superagent.put('/comments/blabla')
    .send(collection)
    .end();
});
```

Also "change" will be emitted when a model in the collection changes.

#### collection.length

Shortcut to `collection.models.length`.

#### collection.at(index)

Returns model beeing at index of `collection.models`.

#### collection.has(uniqueid)

Returns `true` if model with `uniqueid` is inside `collection.models`.

#### collection.get(uniqueid)

Returns model with `uniqueid` from `collection.models`.

#### collection.push(model)

Adds model to collection. Note that `model` should be an instance of
`EventEmitter` else you will get an error as the collection binds to the
models "remove" event.

#### collection.remove(model)

Removes the model from collection.

#### collection.forEach(callback)

Shortcut for `collection.models.forEach`.

#### collection.toJSON()

Returns clone of `collection.models` with `toJSON` called on each model.

## License

Copyright © 2014 Bodo Kaiser <i@bodokaiser.io>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
