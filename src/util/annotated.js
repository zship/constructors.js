define(function(require) {

	'use strict';


	var forOwn = require('mout/object/forOwn');

	//var cloneConstructor = require('./cloneConstructor');


	var _getBases = function(ctor) {
		var ret = [];
		var curr = ctor.prototype;
		while ((curr = Object.getPrototypeOf(curr)) !== Object.prototype) {
			var base = curr.constructor;
			if (base.__meta) {
				ret.push(base);
			}
			else {
				ret.push(annotated(base));
			}
		}
		return ret;
	};


	var annotated = function(ctor) {
		//ctor = cloneConstructor(ctor);

		if (ctor.__meta) {
			return ctor;
		}

		var meta = {};
		meta.name = ctor.name;

		meta.bases = _getBases(ctor);
		if (parent && parent.__meta) {
			meta.bases = meta.bases.concat(parent.__meta.bases);
		}

		meta.members = {};
		meta.accessors = {};
		Object.getOwnPropertyNames(ctor.prototype).forEach(function(name) {
			var descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, name);
			if (descriptor.get || descriptor.set) {
				meta.accessors[name] = descriptor;
			}
			else {
				meta.members[name] = ctor.prototype[name];
			}
		});

		meta.statics = {};
		forOwn(ctor, function(val, key) {
			if (key === '__meta') {
				return;
			}
			meta.statics[key] = val;
		});

		//the user-supplied constructor
		meta.ctor = ctor;

		ctor.__meta = meta;
		return ctor;
	};


	return annotated;

});
