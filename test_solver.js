var assert = require('assert');
var Solver = require('./solver');
var h;

h = new Solver(0);
assert.deepEqual([[], [], []], h.poles());
assert.strictEqual(true, h.finished());
assert.strictEqual(undefined, h.next());

h = new Solver(1);
assert.deepEqual([[1], [], []], h.poles());
assert.strictEqual(false, h.finished());
assert.deepEqual([0, 2], h.next());
assert.deepEqual([[], [], [1]], h.poles());
assert.strictEqual(true, h.finished());
assert.strictEqual(undefined, h.next());

h = new Solver(2);
assert.deepEqual([[2, 1], [], []], h.poles());
assert.strictEqual(false, h.finished());
assert.deepEqual([0, 1], h.next());
assert.deepEqual([[2], [1], []], h.poles());
assert.strictEqual(false, h.finished());
assert.deepEqual([0, 2], h.next());
assert.deepEqual([[], [1], [2]], h.poles());
assert.strictEqual(false, h.finished());
assert.deepEqual([1, 2], h.next());
assert.deepEqual([[], [], [2, 1]], h.poles());
assert.strictEqual(true, h.finished());
assert.strictEqual(undefined, h.next());

h = new Solver(3);
assert.deepEqual([[3, 2, 1], [], []], h.poles());
h.next();assert.deepEqual([[3, 2], [], [1]], h.poles());
h.next();assert.deepEqual([[3], [2], [1]], h.poles());
h.next();assert.deepEqual([[3], [2, 1], []], h.poles());
h.next();assert.deepEqual([[], [2, 1], [3]], h.poles());
h.next();assert.deepEqual([[1], [2], [3]], h.poles());
h.next();assert.deepEqual([[1], [], [3, 2]], h.poles());
h.next();assert.deepEqual([[], [], [3, 2, 1]], h.poles());
assert.strictEqual(true, h.finished());
assert.strictEqual(undefined, h.next());
