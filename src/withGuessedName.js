define(function(require) {

	'use strict';


	var stacktrace = require('stacktrace');

	var annotated = require('./util/annotated');


	/*
	 * Convention: if the result of the call to augment() is
	 * assigned to a variable, we use that name as the class name
	 */
	var withGuessedName = function(ctor) {
		ctor = annotated(ctor);

		//name manually specified
		if (ctor.__meta.name) {
			return ctor;
		}

		var trace = new stacktrace.implementation();
		var stack = trace.run(null);

		var thisFilePos;
		stack.every(function(line, i) {
			if (line.search(/withGuessedName\.js/) !== -1) {
				thisFilePos = i;
				return false;
			}
			return true;
		});

		if (!thisFilePos) {
			return ctor;
		}

		for (var i = thisFilePos + 1; i < stack.length; i++) {
			var parts = stack[i].match(/^.*?((?:file|http|https):\/\/.*?\/.*?)(?::(\d+)).*/);
			var file = parts[1];
			var source = trace.getSource(file);

			if (!source || !source.length) {
				return ctor;
			}

			var lineno = parts[2];
			var line = source[lineno - 1];

			//e.g. (var) (name) = augmented(...
			var rAssigned = /^\s*?(?:var)?\s*?([A-Z]+[a-z]*?)?\s*?=.*?\(/;
			//e.g. augmented( (name) )...
			var rReturned = /\(\s*([A-Z]+[a-z]*)\s*\)/;
			var matches = line.match(rAssigned);

			if (matches) {
				ctor.__meta.name = matches[1].trim();
				return ctor;
			}

			matches = line.match(rReturned);

			if (matches) {
				ctor.__meta.name = matches[1].trim();
				return ctor;
			}
		}

		return ctor;
	};


	return withGuessedName;

});
