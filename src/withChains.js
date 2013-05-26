define(function(require) {

	'use strict';


	var forOwn = require('mout/object/forOwn');
	var merge = require('mout/object/merge');
	var toArray = require('mout/lang/toArray');
	var pipe = require('deferreds/pipe');

	var annotated = require('./util/annotated');


	var withChains = function(ctor) {
		ctor = annotated(ctor);

		var meta = ctor.__meta;
		var proto = ctor.prototype;

		meta.chains = meta.chains || {};

		forOwn(meta.members, function(member, key) {
			if (member.__chained) {
				meta.chains[key] = member.__chained;
			}
		});

		forOwn(meta.statics, function(member, key) {
			if (member.__chained) {
				meta.chains[key] = member.__chained;
			}
		});

		meta.bases.slice(0).reverse().forEach(function(base) {
			meta.chains = merge(meta.chains, base.__meta.chains);
		});

		forOwn(meta.chains, function(type, key) {
			//first/last in the chain should be this ctor
			var bases = [ctor].concat(meta.bases);

			if (type === 'after') {
				bases = bases.reverse();
			}

			proto[key] = function() {
				var args = toArray(arguments);

				bases = bases.filter(function(base) {
					return base.__meta.members.hasOwnProperty(key);
				});

				var methods = bases.map(function(base) {
					return base.__meta.members[key].bind(this);
				}.bind(this));

				if (args.length) {
					//first argument is passed as an argument to the first
					//method
					methods.unshift(args);
				}

				return pipe(methods);
			};
		});

		return ctor;
	};


	return withChains;

});
