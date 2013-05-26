define(function(require) {

	'use strict';


	var forOwn = require('mout/object/forOwn');
	var filter = require('mout/object/filter');
	var isFunction = require('mout/lang/isFunction');

	var annotated = require('./util/annotated');


	var _noSuchMethod = function(key, meta) {
		var className = meta.name;
		var err = className + '#' + key + ': no function by this name in inheritance heirarchy (';
		err += [className].concat(
			meta.bases.map(function(base) {
				return base.__meta.name;
			})
		).join(' > ');
		err += ')';
		return new Error(err);
	};


	var _createSuperMethod = function(superList, key) {
		//keep a pointer to which base class we're operating on, so that
		//upstream _super calls are directed to methods progressively higher in
		//the chain
		var superPointer = 0;

		var ret = function() {
			var superFn = superList[superPointer];
			superPointer++;

			if (!superFn) {
				throw _noSuchMethod(key, this.constructor.__meta);
			}

			var ret = superFn.apply(this, arguments);
			superPointer = 0;
			return ret;
		};

		ret.nom = key;
		return ret;
	};


	var _superNoop = function() {
		throw new Error('_super must be called within a function defined on a contructor or prototype');
	};


	var _invokesSuper = function(member) {
		if (!isFunction(member)) {
			return false;
		}
		return member.toString().search(/this\._super\s*\(/) !== -1;
	};


	var withSuper = function(ctor) {
		ctor = annotated(ctor);

		var meta = ctor.__meta;
		var proto = ctor.prototype;

		var cache = {
			members: {},
			statics: {}
		};

		forOwn(filter(meta.members, _invokesSuper), function(member, key) {
			var superList = meta.bases
				.filter(function(base) {
					return base.__meta.members.hasOwnProperty(key);
				})
				.map(function(base) {
					return base.__meta.members[key];
				});

			cache.members[key] = _createSuperMethod(superList, key);

			proto[key] = function() {
				if (!this._super || this._super.nom !== key) {
					this._super = cache.members[key];
				}
				var ret = member.apply(this, arguments);
				this._super = _superNoop;
				return ret;
			};
		});

		forOwn(filter(meta.statics, _invokesSuper), function(member, key) {
			var superList = meta.bases
				.filter(function(base) {
					return base.__meta.statics.hasOwnProperty(key);
				})
				.map(function(base) {
					return base.__meta.statics[key];
				});

			cache.statics[key] = _createSuperMethod(superList, key);

			ctor[key] = function() {
				if (!this._super || this._super.nom !== key) {
					this._super = cache.statics[key];
				}
				var ret = member.apply(this, arguments);
				this._super = _superNoop;
				return ret;
			};
		});

		return ctor;
	};


	return withSuper;

});
