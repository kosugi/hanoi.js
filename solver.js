;
if (typeof require !== 'undefined') {
    var _ = require('underscore');
}

var Pole = function(n) {
    var discs = [];
    while (0 < n) {
        discs.push(n--);
    }
    return {
        peek: function() { return discs[discs.length - 1]|0; },
        pop: function() { return discs.pop(); },
        push: function(n) { discs.push(n); },
        size: function() { return discs.length; },
        discs: function() { return discs.slice(0); }
    };
};

var Solver = function(N) {
    var step = 0;
    var poles = [new Pole(N), new Pole(0), new Pole(0)];
    var next0s = (N & 1)? [2, 1, 0]: [1, 2, 0];
    var min = function(l, r) {
        return (r <= 0)? l: Math.min(r, l);
    }
    return {
        poles: function() {
            return _.map(poles, function(x) { return x.discs(); });
        },
        finished: function() {
            return poles[2].size() === N;
        },
        next: function() {
            if (this.finished()) return;
            var ts = _.map(poles, function(x) { return x.peek(); });
            var i0 = _.indexOf(ts, 1);
            var from, to;
            if (++step & 1) {
                from = i0;
                to = next0s[(step >> 1) % 3];
            }
            else {
                ts[i0] = -1;
                from = _.indexOf(ts, _.reduce(ts, min, N + 1));
                ts[from] = -1;
                to = _.indexOf(ts, _.reduce(ts, min, N + 1));
                if (to < 0) {
                    to = _.indexOf(ts, 0);
                }
            }
            poles[to].push(poles[from].pop());
            return [from, to];
        }
    };
};

if (typeof module !== 'undefined') {
    module.exports = Solver;
}
