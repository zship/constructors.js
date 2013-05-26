define(function(require){

	'use strict';


	var chained = require('chained');
	var _ = chained._;
	var withChains = require('withChains');
	var Deferred = require('deferreds/Deferred');


	module('withChains');


	asyncTest('Chaining and Deferreds', function() {
		var startCalled = [];
		var stopCalled = [];
		var startCompleted = false;
		var stopCompleted = false;

		var A = function() {
			this.contextTest = 'A';
		};

		A.prototype.start = chained(function() {
			startCalled.push('A');
			strictEqual(this.contextTest, 'B', 'A: chained method retains context');
			var deferred = new Deferred();
			window.setTimeout(function() {
				startCompleted = true;
				deferred.resolve();
			}, 0);
			return deferred;
		}, _);

		A.prototype.stop = chained(_, function() {
			stopCalled.push('A');
			strictEqual(stopCompleted, true, 'A: A.stop waited for B.stop to complete');
		});

		A = withChains(A);

		var B = function() {
			this.contextTest = 'B';
		};

		B.prototype = Object.create(A.prototype);
		B.prototype.constructor = B;

		B.prototype.start = function() {
			startCalled.push('B');
			strictEqual(this.contextTest, 'B', 'B: chained method retains context');
			strictEqual(startCompleted, true, 'B: B.start waited for A.start to complete');
		};

		B.prototype.stop = function() {
			stopCalled.push('B');
			var deferred = new Deferred();
			window.setTimeout(function() {
				stopCompleted = true;
				deferred.resolve();
			}, 0);
			return deferred;
		};

		B = withChains(B);

		var b = new B();
		b.start().then(function() {
			strictEqual(startCalled.join(' '), 'A B', 'A.start called before B.start');
			b.stop().then(function() {
				strictEqual(stopCalled.join(' '), 'B A', 'B.stop called before A.stop');
				start();
			});
		});
	});


	asyncTest('Chaining with missing link', function() {
		var startCalled = [];

		var A = function() {};
		A.prototype.start = chained(function() {
			startCalled.push('A');
		}, _);
		A = withChains(A);

		var B = function() {};
		B.prototype = Object.create(A.prototype);
		B.prototype.constructor = B;

		var C = function() {};
		C.prototype = Object.create(B.prototype);
		C.prototype.constructor = C;
		C.prototype.start = function() {
			startCalled.push('C');
		};
		C = withChains(C);

		var c = new C();
		c.start().then(function() {
			strictEqual(startCalled.join(' '), 'A C', 'A.start called, then C.start');
			start();
		});
	});


});
