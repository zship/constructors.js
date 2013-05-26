define(function(require){

	'use strict';


	var withGuessedName = require('withGuessedName');
	var augmented = require('augmented');


	module('withGuessedName');


	test('Guessing class names from source', function() {
		var A = function() {};
		A = withGuessedName(A);
		strictEqual(A.__meta.name, 'A', 'var A = withGuessedName(A) - guessed "A"');

		var B= function() {};
		B = withGuessedName(B);
		strictEqual(B.__meta.name, 'B', 'var B= withGuessedName(B) - guessed "B"');

		var O = (function() {
			var C = function() {};
			return withGuessedName(C);
		})();

		strictEqual(O.__meta.name, 'C', 'var O=(function(){ var C = ... return withGuessedName(C) })() - guessed "C"');

		var D = function() {};
		D = augmented(D);
		strictEqual(D.__meta.name, 'D', 'var D = augmented(D) - guessed "D"');

		var E = function NamedCtor() {};
		E = augmented(E);
		strictEqual(E.__meta.name, 'NamedCtor', 'var E = function NamedCtor()... - did not attempt guess and used "NamedCtor"');
	});

});
