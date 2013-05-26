define(function(require){

	'use strict';


	var withSuper = require('withSuper');


	module('withSuper');


	test('_super', function() {
		//in AOP "before" order
		var called = [];

		var A = function() {};
		A.prototype.start = function() {
			called.push('A');
		};

		var B = function() {};
		B.prototype = Object.create(A.prototype);
		B.prototype.constructor = B;
		B.prototype.start = function() {
			this._super();
			called.push('B');
		};
		B = withSuper(B);

		var C = function() {};
		C.prototype = Object.create(B.prototype);
		C.prototype.constructor = B;
		C.prototype.start = function() {
			this._super();
			called.push('C');
		};
		C = withSuper(C);

		var c = new C();
		c.start();

		strictEqual(called.join(' '), 'A B C', '_start called before: methods called in correct order');


		//in AOP "after" order
		called = [];
		A = function() {};
		A.prototype.start = function() {
			called.push('A');
		};

		B = function() {};
		B.prototype = Object.create(A.prototype);
		B.prototype.constructor = B;
		B.prototype.start = function() {
			called.push('B');
			this._super();
		};
		B = withSuper(B);

		C = function() {};
		C.prototype = Object.create(B.prototype);
		C.prototype.constructor = C;
		C.prototype.start = function() {
			called.push('C');
			this._super();
		};
		C = withSuper(C);

		c = new C();
		c.start();

		strictEqual(called.join(' '), 'C B A', '_start called after: methods called in correct order');


		//missing a link in the chain
		called = [];
		A = function A() {};
		A.prototype.start = function() {
			called.push('A');
		};

		B = function B() {};
		B.prototype = Object.create(A.prototype);
		B.prototype.constructor = B;

		C = function C() {};
		C.prototype = Object.create(B.prototype);
		C.prototype.constructor = C;
		C.prototype.start = function() {
			called.push('C');
			this._super();
		};
		C = withSuper(C);

		c = new C();
		c.start();

		strictEqual(called.join(' '), 'C A', 'superclass missing a method: skip to next superclass in the chain');


		//returning values from _super()
		A = function() {};
		A.prototype.start = function() {
			return 'A1';
		};

		B = function() {};
		B.prototype = Object.create(A.prototype);
		B.prototype.constructor = B;
		B.prototype.start = function() {
			return this._super() + ' B2';
		};
		B = withSuper(B);

		C = function() {};
		C.prototype = Object.create(B.prototype);
		C.prototype.constructor = C;
		C.prototype.start = function() {
			return this._super() + ' C3';
		};
		C = withSuper(C);

		c = new C();
		var ret = c.start();

		strictEqual(ret, 'A1 B2 C3', 'returning values from _super');


		//passing args to _super()
		A = function() {};
		A.prototype.start = function(arg) {
			return 'A' + arg;
		};

		B = function() {};
		B.prototype = Object.create(A.prototype);
		B.prototype.constructor = B;
		B.prototype.start = function(arg) {
			return this._super('B' + arg);
		};
		B = withSuper(B);

		C = function() {};
		C.prototype = Object.create(B.prototype);
		C.prototype.constructor = C;
		C.prototype.start = function() {
			return this._super('C');
		};
		C = withSuper(C);

		c = new C();
		ret = c.start();

		strictEqual(ret, 'ABC', 'passing arguments to _super');


		//calling super outside of a method
		throws(function() {
			c._super();
		}, 'calling super outside of a class method throws an error');
	});

});
