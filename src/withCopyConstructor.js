define(function(require) {

	'use strict';


	var withBeforeConstruct = require('./withBeforeConstruct');


	var withCopyConstructor = function(ctor) {
		return withBeforeConstruct(function(other) {
			var meta = this.constructor.__meta;
			if (arguments.length === 1 && (other.constructor === this.constructor || meta.bases.indexOf(other.constructor) !== -1)) {
				this._data = other.clone()._data;
				return this;
			}
		}, ctor);
	};


	return withCopyConstructor;

});
