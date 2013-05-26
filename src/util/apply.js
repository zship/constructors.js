define(function(require) {

	'use strict';


	var forOwn = require('mout/object/forOwn');
	var filter = require('mout/object/filter');


	var apply = function(opts, obj) {
		var descriptors = obj.constructor.__meta.accessors;

		opts = filter(opts, function(val) {
			return val !== undefined && val !== null;
		});

		//set _data before calling setters, in case setter refers to other
		//properties in _data
		forOwn(opts, function(val, key) {
			if (descriptors[key]) {
				obj._data[key] = opts[key];
			}
		}.bind(this));

		forOwn(opts, function(val, key) {
			if (descriptors[key]) {
				obj[key] = val;
			}
		}.bind(this));
	};


	return apply;

});
