/*jshint evil:true, strict:false */
define(function(require) {

	var compose = require('mout/function/compose');

	var withGuessedName = require('./withGuessedName');
	var withSuper = require('./withSuper');
	var withClone = require('./withClone');
	var withEquals = require('./withEquals');
	var withChains = require('./withChains');
	var withDisplayName = require('./withDisplayName');
	var withForcedNew = require('./withForcedNew');
	var withCopyConstructor = require('./withCopyConstructor');



	var priority = [
		withGuessedName,
		withSuper,
		withClone,
		withEquals,
		withChains,
		withDisplayName,
		withForcedNew,
		withCopyConstructor
	];


	/**
	 * @param {Constructor} [ctor]
	 * @return {Constructor}
	 */
	var augmented = compose.apply(undefined, priority.reverse());


	return augmented;

});
