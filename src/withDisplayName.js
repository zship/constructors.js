define(function(require) {

	'use strict';


	var forOwn = require('mout/object/forOwn');
	var isFunction = require('mout/lang/isFunction');

	var annotated = require('./util/annotated');


	var withDisplayName = function(ctor) {
		ctor = annotated(ctor);

		var meta = ctor.__meta;
		var proto = ctor.prototype;

		forOwn(proto, function(val, key) {
			if (isFunction(val)) {
				val.displayName = meta.name + '#' + key;
			}
		});

		forOwn(ctor, function(val, key) {
			if (isFunction(val)) {
				val.displayName = meta.name + '.' + key;
			}
		});

		return ctor;
	};


	return withDisplayName;

});
