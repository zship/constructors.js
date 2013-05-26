define(function(require) {

	'use strict';


	var withBeforeConstruct = require('./withBeforeConstruct');


	var withForcedNew = function(ctor) {
		var $Name$;
		return withBeforeConstruct(function() {
			if (Object.getPrototypeOf(this) !== $Name$.prototype) {
				throw new Error('$Name$ constructor was called without the "new" keyword');
			}
		}, ctor);
	};


	return withForcedNew;

});
