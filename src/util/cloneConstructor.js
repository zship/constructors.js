define(function(require) {

	'use strict';


	var forOwn = require('mout/object/forOwn');


	var cloneConstructor = function(ctor) {
		if(ctor.__clonedFrom) {
			ctor = ctor.__clonedFrom;
		}

		var temp = function() {
			var ret = ctor.apply(this, arguments);
			if (ret) {
				return ret;
			}
		};

		forOwn(ctor, function(val, key) {
			temp[key] = val;
		});

		temp.__clonedFrom = ctor;
		temp.prototype = ctor.prototype;
		temp.prototype.constructor = temp;

		return temp;
	};


	return cloneConstructor;

});
