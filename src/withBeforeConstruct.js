/*jshint evil:true, strict:false */
define(function(require) {

	'use strict';


	var forOwn = require('mout/object/forOwn');

	var annotated = require('./util/annotated');


	var $Before$;
	var _evaldCtor = function(originalConstructor) {
		return function $Name$() {
			//signal minifiers to avoid mangling names in this eval'd scope
			eval('');

			//the following is eval'd from
			//constructors/withBeforeConstruct in order to override the
			//constructor name given in common debuggers. more:
			//http://stackoverflow.com/questions/8073055/minor-drawback-with-crockford-prototypical-inheritance/8076515

			$Before$;

			//give user the opportunity to override return value
			return originalConstructor.apply(this, arguments);
			//@ sourceURL=withBeforeConstruct.js
		};
	};


	var withBeforeConstruct = function(fn, ctor) {
		ctor = annotated(ctor);

		var meta = ctor.__meta;
		var proto = ctor.prototype;

		meta.evald = meta.evald || [];
		var innerFn = fn.toString()
			.trim()
			.replace(/^function\s*\(.*?\)\s*\{/, '')
			.replace(/\}$/, '');
		meta.evald.push(innerFn);

		ctor = eval(
			'1&&function ' +
			_evaldCtor(meta.ctor)
				.toString()
				.replace(/\$Before\$;/g, meta.evald.join('\n\n'))
				.replace(/\$Name\$/g, meta.name)
				.replace(/^function\s+/, '')
	    );

		ctor.__meta = meta;
		ctor.prototype = proto;
		proto.constructor = ctor;

		meta.bases.slice(0).reverse().forEach(function(base) {
			forOwn(base._meta.statics, function(val, key) {
				ctor[key] = val;
			});
		});

		if (Object.getOwnPropertyDescriptor(ctor, 'name').writable) {
			//when support for writing the 'name' property arrives
			//https://code.google.com/p/chromium/issues/detail?id=17356#c30
			ctor.name = meta.name;
		}

		return ctor;
	};


	return withBeforeConstruct;

});
