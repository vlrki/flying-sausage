// Canvas
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');

// Sprite
var sprite = new Image();
sprite.src = 'img/sprites.png';

// CONST AND VARS
let frames = 0;
const DEGREE = Math.PI / 180;
const PRIZES_COUNT = 10;

// GAME STATE
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2,
    victory: 3,
}

// SCORE
const score = {
    prizes: 0,
    value: 0,

    draw: function () {
        ctx.fillStyle = '#b35024';

        if (state.current == state.game) {
            ctx.font = "46px Thintel";
            ctx.textBaseline = "top";
            ctx.textAlign = "right";
            ctx.fillText('ПРИЗОВ ' + this.value + ' ИЗ ' + PRIZES_COUNT, cvs.width - 31, 36);
        }
    },

    update: function () {
        if (score.prizes > PRIZES_COUNT) {
            if (score.value == PRIZES_COUNT) {
                state.current = state.victory;
            } else {
                state.current = state.over;
            }
        }
    },

    reset: function () {
        this.prizes = 0;
        this.value = 0;
    }
}

// CONTROL
cvs.addEventListener('click', function (e) {
    switch (state.current) {
        case state.getReady:

            state.current = state.game;
            break;
        case state.game:
            sausage.fly();
            break;
        case state.over:
            reset()
            state.current = state.getReady;
            break;
        case state.victory:
            reset()
            state.current = state.getReady;
            break;
    }
});

// Background
const bg = {
    sX: 0,
    sY: 0,
    w: 1000,
    h: 813,
    x: 0,
    y: cvs.height - 813,
    dx: 1,

    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update: function () {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % this.w;
        }
    },

    reset: function () {
        // this.sX = 0;
        // this.sY = 0;
        // this.w = 1000;
        // this.h = 813;
        this.x = 0;
        // this.y = cvs.height - 813;
        // this.dx = 1;
    }
}

// Foreground
const fg = {
    sX: 0,
    sY: 813,
    w: 456,
    h: 75,
    x: 0,
    y: cvs.height - 75,
    dx: 2,

    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update: function () {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % this.w;
        }
    },

    reset: function () {
        this.x = 0;
    }
}

// Sausage
const sausage = {
    animation: [
        { sX: 120, sY: 888 },
        { sX: 237, sY: 888 },
    ],
    w: 117,
    h: 139,
    x: 100,
    y: 100,

    radius: 50,

    frame: 0,

    speed: 0,
    gravity: 0.25,
    jump: 5,
    rotation: 0,

    draw: function () {
        let sausage = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, sausage.sX, sausage.sY, this.w, this.h, -Math.floor(this.w / 2), -Math.floor(this.h / 2), this.w, this.h);
        ctx.restore();

        this.frame == 0 ? this.frame = 1 : this.frame = 0;
    },

    update: function () {
        if (state.current == state.getReady) {
            this.x = 100;
            this.y = 100;
            this.speed = 0;
            this.rotation = 0 * DEGREE;
        }

        if (state.current == state.game) {
            this.frame = frames % 5 ? +!this.frame : this.frame;

            this.speed += this.gravity;
            this.y += this.speed;

            if (this.speed <= 0) {
                this.rotation = -5 * DEGREE;
            } else {
                this.rotation = 0 * DEGREE;
            }

            if (this.y + this.h / 3 >= cvs.height - fg.h) {
                state.current = state.over;
                this.rotation = 45 * DEGREE;
            }
        }
    },

    fly: function () {
        this.speed = -this.jump;
    },

    reset: function () {
        this.frame = 0;
        this.x = 100;
        this.y = 100;
        this.speed = 0;
        this.rotation = 0 * DEGREE;
    }
}

// FLAGS
const flags = {
    position: [],

    sX: 0,
    sY: 888,
    w: 120,
    h: 601,
    minYPos: 200,
    maxYPos: 550,
    dx: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let yPos = p.y;

            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, p.x, yPos, this.w, this.h);
        }
    },

    update: function () {
        if (state.current !== state.game) return;

        if ((frames - 50) % 300 == 0) {
            this.position.push({
                x: cvs.width,
                y: this.minYPos + (this.maxYPos - this.minYPos) * Math.random()
            })
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            p.x -= this.dx;

            let flagY = p.y;

            if (sausage.x + sausage.radius > p.x
                && sausage.x - sausage.radius < p.x + this.w
                && sausage.y + sausage.radius > p.y
                && sausage.y - sausage.radius < p.y + this.h
            ) {
                state.current = state.over;
            }
        }
    },

    reset: function () {
        this.position = [];
    }
}

// PRIZES
const prizes = {
    position: [],

    prizes: [
        { sX: 120, sY: 1027 },
        { sX: 181, sY: 1027 },
        { sX: 242, sY: 1027 },
    ],
    prize: 0,
    got: [],

    w: 61,
    h: 68,
    dx: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            if (!this.position[i].got) {
                let p = this.position[i];

                let yPos = p.y;

                ctx.drawImage(sprite, this.prizes[p.prize].sX, this.prizes[p.prize].sY, this.w, this.h, p.x, yPos, this.w, this.h);
            }
        }
    },

    update: function () {
        if (state.current !== state.game) return;

        if ((frames - 200) % 300 == 0) {
            this.position.push({
                x: cvs.width,
                y: 600,
                prize: this.prize,
                got: 0,
            });

            this.prize = this.prize == 2 ? this.prize = 0 : this.prize + 1;
            score.prizes++;
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            p.x -= this.dx;

            if (sausage.x + sausage.radius > p.x
                && sausage.x - sausage.radius < p.x + this.w
                && sausage.y + sausage.radius > p.y
                && sausage.y - sausage.radius < p.y + this.h
            ) {
                // If prize wasn't got before
                if (!p.got) {
                    this.position[i].got = 1;
                    score.value++;
                }
            }
        }
    },

    reset: function () {
        this.position = [];
    }
}

// GetReady
const getReady = {
    sX: 0,
    sY: 1489,
    w: 457,
    h: 813,
    x: 0,
    y: 0,

    draw: function () {
        if (state.current == state.getReady) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

// GameOver
const gameOver = {
    sX: 456,
    sY: 1489,
    w: 457,
    h: 813,
    x: 0,
    y: 0,

    draw: function () {
        if (state.current == state.over) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

// Victory
const victory = {
    sX: 912,
    sY: 1489,
    w: 457,
    h: 813,
    x: 0,
    y: 0,

    draw: function () {
        if (state.current == state.victory) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

// DRAW
function draw() {
    bg.draw();
    fg.draw();
    flags.draw();
    prizes.draw();
    sausage.draw();
    score.draw();
    getReady.draw();
    gameOver.draw();
    victory.draw();
}

// UPDATE
function update() {
    bg.update();
    fg.update();
    score.update();
    flags.update();
    prizes.update();
    sausage.update();
    // score.update();
}

// RESET GAME
function reset() {    
    frames = 0;
    bg.reset();
    fg.reset();
    flags.reset();
    prizes.reset();
    sausage.reset();
    score.reset();
}

// LOOP
function loop() {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}

loop();
