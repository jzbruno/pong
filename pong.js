(function () {
    'use strict';

    function Game(canvasId) {
        var canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.ball = new Ball(this.width / 2, this.height / 2);
        this.player = new Player((this.height / 2) - 40, 80);
        this.computer = new Computer(this.width - 20, (this.height / 2) - 40, 60, this.ball);

        this.score = {
            player: 0,
            computer: 0
        };

        var self = this;
        var tick = function () {
            self.update();
            self.draw();
            requestAnimationFrame(tick);
        };
        tick();
    }

    Game.prototype = {
        update: function () {
            this.ball.update(this);
            this.player.update(this);
            this.computer.update(this);
        },
        draw: function () {
            this.ctx.clearRect(0, 0, this.width, this.height);

            // Draw entities.
            this.ball.draw(this.ctx);
            this.player.draw(this.ctx);
            this.computer.draw(this.ctx);

            // Draw center line.
            this.ctx.moveTo(this.width / 2, 10);
            this.ctx.lineTo(this.width / 2, this.height - 10);
            this.ctx.stroke();

            // Draw score.
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.strokeText(
                String(this.score.player), (this.width / 2) - 30, this.height - 10);
            this.ctx.textAlign = 'left';
            this.ctx.strokeText(
                String(this.score.computer), (this.width / 2) + 30, this.height - 10, 60);
        }
    };

    function Ball(x, y) {
        // Set initial position.
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.width = this.radius * 2;
        this.height = this.radius * 2;

        // Set initial velocity.
        this.vx = 5;
        this.vy = 5;
    }

    Ball.prototype = {
        update: function (game) {
            this.y += this.vy;
            this.x += this.vx;

            if (this.y + this.radius >= game.height || this.y - this.radius <= 0) {
                this.vy = -this.vy;
            }
            if (this.x + this.radius >= game.width || this.x - this.radius <= 0) {
                this.vx = -this.vx;
            }

            if (collision(this, game.player)) {
                this.vx = -this.vx;
            }
            if (collision(this, game.computer)) {
                this.vx = -this.vx;
            }

            if (this.x + this.radius >= game.width) {
                game.score.player += 1;
                this.x = game.width / 2;
                this.y = game.height / 2;
            }
            if (this.x - this.radius <= 0) {
                game.score.computer += 1;
                this.x = game.width / 2;
                this.y = game.height / 2;
            }
        },
        draw: function (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 2 * Math.PI, 0);
            ctx.stroke();
            ctx.closePath();
        }
    };

    function Player(y, length) {
        // Set initial position.
        this.x = 10;
        this.y = y;
        this.width = 10;
        this.height = length;
        this.speed = 5;

        this.controller = new Controller();
    }

    Player.prototype = {
        update: function (game) {
            if (this.controller.isDown(this.controller.UP)) {
                this.y -= this.speed;
            } else if (this.controller.isDown(this.controller.DOWN)) {
                this.y += this.speed;
            }

            if (this.y < 0) {
                this.y = 0;
            } else if (this.y + this.height > game.height) {
                this.y = game.height - this.height;
            }
        },
        draw: function (ctx) {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    };

    function Computer(x, y, length, ball) {
        // Set initial position.
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = length;
        this.speed = 5;
        this.ball = ball;
    }

    Computer.prototype = {
        update: function () {
            var delta = this.y - this.ball.y;
            if (delta < 0) {
                this.y += this.speed;
            } else if (delta > this.speed) {
                this.y -= this.speed;
            }
        },
        draw: function (ctx) {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    };

    function Controller() {
        var states = {};

        window.onkeydown = function (e) {
            states[e.keyCode] = true;
        };
        window.onkeyup = function (e) {
            states[e.keyCode] = false;
        };
        this.isDown = function (keyCode) {
            return states[keyCode] === true;
        };

        this.UP = 38;
        this.DOWN = 40;
    }

    function collision(a, b) {
        return !(
        a.y + a.height < b.y ||
        a.y > b.y + b.height ||
        a.x + a.width / 2 < b.x ||
        a.x > b.x + b.width / 2);
    }

    window.onload = function () {
        new Game('screen');
    };
})();
