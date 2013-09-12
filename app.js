;
if (typeof require !== 'undefined') {
    var _ = require('underscore');
    var Solver = require('solver');
}

var App = function() {

    var STATE_STOP = 0;
    var STATE_PLAY = 1;
    var STATE_PAUSE = 2;
    var NUM_DISCS_MIN = 1;
    var NUM_DISCS_MAX = 8;
    var SPEED_MIN = 0;
    var SPEED_MAX = 100;
    var colors = [
        ['#F66', '#C33'],
        ['#FC6', '#C63'],
        ['#FF6', '#CC3'],
        ['#CF6', '#6C3'],
        ['#6F6', '#3C3'],
        ['#6FC', '#3C6'],
        ['#6FF', '#3CC'],
        ['#6CF', '#36C']
    ];

    return {

        Hanoi: Backbone.Model.extend({
            defaults: {
                solver: null,
                numDiscs: 8,
                speed: 50,
                state: STATE_STOP
            },
            validate: function(attrs) {
                if (!(NUM_DISCS_MIN <= attrs.numDiscs && attrs.numDiscs <= NUM_DISCS_MAX)) {
                    return 'numDiscs sould be in range (' + NUM_DISCS_MIN + ', ' + NUM_DISCS_MAX + ')';
                }
                if (!(SPEED_MIN <= attrs.speed && attrs.speed <= SPEED_MAX)) {
                    return 'speed sould be in range (' + SPEED_MIN + ', ' + SPEED_MAX + ')';
                }
                if (!_.contains([STATE_STOP, STATE_PLAY, STATE_PAUSE], attrs.state)) {
                    return 'bad state';
                }
            },
            initialize: function(attrs, options) {
                this.initSolver();
            },
            initSolver: function() {
                this.set('solver', new Solver(this.get('numDiscs')));
            }
        }),


        HanoiView: Backbone.View.extend({
            el: $('#hanoi'),
            events: {
                'click #btn-play': 'play',
                'click #btn-stop': 'stop',
                'click #btn-pause': 'pause',
                'slide #slider-discs': 'changeSlideDiscs',
                'slide #slider-speed': 'changeSlideSpeed'
            },
            initialize: function () {
                $('#slider-discs').slider({ min: NUM_DISCS_MIN, max: NUM_DISCS_MAX, step: 1, value: this.model.get('numDiscs') });
                $('#slider-speed').slider({ min: SPEED_MIN, max: SPEED_MAX, step: 1, value: this.model.get('speed') });
                var canvas = $('#canvas');
                canvas.css('width', canvas.attr('width'));
                canvas.css('height', canvas.attr('height'));
                this.render();
            },
            calcInterval: function() {
                return this.model.get('speed') + 100;
            },
            onTimer: function() {
                console.log('onTimer');
                if (this.model.get('state') !== STATE_PLAY) {
                    return;
                }
                var solver = this.model.get('solver');
                this.render();
                if (!solver.next()) { // とりあえず捨てる
                    return;
                }
                setTimeout(_.bind(this.onTimer, this), this.calcInterval());
            },
            play: function(e) {
                console.log('play');
                setTimeout(_.bind(this.onTimer, this), this.calcInterval());
                this.model.set('state', STATE_PLAY);
                this.render();
            },
            stop: function(e) {
                console.log('stop');
                this.model.set('state', STATE_STOP);
                this.model.initSolver();
                this.render();
            },
            pause: function(e) {
                console.log('pause');
                this.model.set('state', STATE_PAUSE);
                this.render();
            },
            changeSlideDiscs: function(e, ui) {
                console.log('changeSlideDiscs: ' + ui.value);
                if (this.model.get('numDiscs') !== ui.value) {
                    this.model.set('numDiscs', ui.value);
                    this.stop();
                }
                this.render();
            },
            changeSlideSpeed: function(e, ui) {
                console.log('changeSlideSpeed: ' + ui.value);
                this.model.set('speed', ui.value);
                this.render();
            },
            render: function() {
                $('#value-discs').text(this.model.get('numDiscs'));
                $('#value-speed').text(this.model.get('speed'));
                var state = this.model.get('state');
                if (state === STATE_PLAY) {
                    $('#btn-play').hide();
                    $('#btn-pause').show();
                }
                else {
                    $('#btn-play').show();
                    $('#btn-pause').hide();
                }
                $('#btn-pause').attr('disabled', this.model.get('solver').finished());
                this.rederCanvas();
                return this;
            },
            rederCanvas: function() {
                var canvas = $('#canvas');
                var width = canvas.attr('width');
                var height = canvas.attr('height');
                var h = 14;
                var gh = 35;
                var ctx = canvas.get(0).getContext('2d');
                ctx.lineWidth = 2;

                ctx.fillStyle = '#FFF';
                ctx.fillRect(0, 0, width, height);

                var g = ctx.createLinearGradient(0, 0, width * 0.5, height * 1.5);
                g.addColorStop(0, '#CFF');
                g.addColorStop(1, '#EFF');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, width, height - gh + h);

                ctx.fillStyle = '#944';
                ctx.fillRect(0, height - gh + h, width, gh - h);

                ctx.strokeStyle = '#CCC';
                ctx.strokeRect(0, 0, width, height);
                var poles = this.model.get('solver').poles();
                ctx.lineWidth = 1;
                _.each(poles, function(pole, x) {
                    _.each(pole, function(disc, y) {
                        var w = disc * 15;
                        var bx = 120 * x + 80;
                        var by = height - gh - y * h;
                        ctx.fillStyle = colors[disc - 1][0];
                        ctx.fillRect(bx - w / 2, by + 1, w, h - 1);
                        ctx.strokeStyle = colors[disc - 1][1];
                        ctx.strokeRect(bx - w / 2, by + 1, w, h - 1);
                    });
                });
                return this;
            }
        })


    };
};

if (typeof module !== 'undefined') {
    module.exports = App;
}
