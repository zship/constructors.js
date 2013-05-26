define(function(require) {

	'use strict';


	var toArray = require('mout/lang/toArray');


	var _ = {};


	var chained = function() {
		var args = toArray(arguments);
		var fn;
		if (args[0] === _) {
			fn = args[1];
			fn.__chained = 'before';
		}
		else {
			fn = args[0];
			fn.__chained = 'after';
		}
		return fn;
	};


	chained._ = _;


	return chained;

});
