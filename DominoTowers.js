/*global Domino, GJAPI*/
var DominoTowers = function (canvas, image) {
  'use strict';
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  this.context.font = '40px Georgia';
  this.context.textBaseline = 'bottom';
  this.context.textAlign = 'right';
  this.context.fillStyle = '#630';
  this.image = image;
  this.available = [];
  this.builtin = [];
  this.offsetX = 0;
  this.offsetY = 0;
  window.setInterval(this.update.bind(this), 20);
  window.setInterval(this.draw.bind(this), 20);
  this.canvas.addEventListener('click', this);
};

DominoTowers.prototype.handleEvent = function (e) {
  'use strict';
  var top, bottom, slot;
  this.canvas.removeEventListener('click', this);
  this.hidden = [];
  for (top = 0; top < 6; top += 1) {
    for (bottom = 0; bottom < 6; bottom += 1) {
      this.hidden.push(new Domino(top, bottom));
    }
  }
  this.available = [];
  for (slot = 0; slot < 6; slot += 1) {
    this.available.push(this.addRandomFrom(this.hidden));
    this.available[slot].panToSlot(slot,
                                   this.build.bind(this),
                                   this.canvas,
                                   this.context,
                                   this.image);
  }
  this.base = 0;
  this.builtin = [];
  this.builtin[this.base] = [];
  this.last = new Date();
  this.score = 0;
  this.gameover = false;
  this.bonus = 0;
};

DominoTowers.prototype.getNext = function (from, to) {
  'use strict';
  if (to > from + 4) {
    return from + Math.floor((to - from) / 4);
  }
  if (to < from - 4) {
    return from - Math.floor((from - to) / 4);
  }
  return to;
};

DominoTowers.prototype.update = function () {
  'use strict';
  var slot, base, level;
  if (this.available.length) {
    for (slot = 0; slot < this.available.length; slot += 1) {
      if (this.available[slot]) {
        this.available[slot].update();
      }
    }
  }
  this.offsetX = this.getNext(this.offsetX, this.targetOffsetX);
  this.offsetY = this.getNext(this.offsetY, this.targetOffsetY);
  if (this.builtin.length) {
    for (base = 0; base <= this.base; base += 1) {
      for (level = 0; level < this.builtin[base].length; level += 1) {
        if (this.builtin[base][level]) {
          this.builtin[base][level].offsetX = this.offsetX;
          this.builtin[base][level].offsetY = this.offsetY;
          this.builtin[base][level].update();
        }
      }
    }
  }
};

DominoTowers.prototype.draw = function () {
  'use strict';
  var slot, base, level;
  this.context.drawImage(this.image, 600, 0, 600, 600, 0, 0, 600, 600);
  if (this.builtin.length) {
    for (base = 0; base <= this.base; base += 1) {
      if (this.builtin[base].length === 0) {
        this.context.fillText('Click on', 575, 250);
        this.context.fillText('a domino', 575, 300);
        this.context.fillText('to start', 575, 350);
        this.context.fillText('a tower!', 575, 400);
      }
      for (level = 0; level < this.builtin[base].length - 1; level += 1) {
        if (this.builtin[base][level]) {
          this.builtin[base][level].draw(1);
        }
      }
      if (this.builtin[base][this.builtin[base].length - 1]) {
        this.builtin[base][this.builtin[base].length - 1].draw(2);
      }
      this.context.drawImage(this.image, 0, 500, 600, 100,
                            this.offsetX + base * 100 - 25, this.offsetY,
                             300, 50);
    }
  } else {
    this.context.fillText('Click to start!', 575, 250);
  }
  this.context.drawImage(this.image, 0, 300, 600, 200, 0, 0, 600, 200);
  if (this.available.length) {
    for (slot = 0; slot < this.available.length; slot += 1) {
      if (this.available[slot]) {
        if (this.builtin[this.base][0]) {
          if (this.available[slot] &&
              this.available[slot].bottom === this.builtin[this.base][0].top) {
            this.available[slot].draw(1);
          } else {
            this.available[slot].draw(0);
          }
        } else {
          this.available[slot].draw(1);
        }
      }
    }
  }
  if (this.gameover) {
    this.context.fillText('No more', 575, 250);
    this.context.fillText('dominoes!', 575, 300);
  }
  this.context.fillStyle = '#630';
  this.context.fillText(this.score ? 'Score: ' + this.score : '', 575, 500);
  this.context.fillText(this.bonus > 1 ? 'x' + this.bonus : '', 575, 550);
  this.context.fillStyle = '#fff';
};

DominoTowers.prototype.addRandomFrom = function (array) {
  'use strict';
  return array.splice(Math.floor(Math.random() * array.length), 1)[0];
};

DominoTowers.prototype.build = function (slot) {
  'use strict';
  var s, restart, now;
  if (this.builtin[this.base][0] &&
      this.available[slot].bottom !== this.builtin[this.base][0].top) {
    return false;
  }
  this.builtin[this.base].unshift(this.available[slot]);
  this.builtin[this.base][0].x = -this.offsetX + slot * 100;
  this.builtin[this.base][0].y = -this.offsetY;
  this.builtin[this.base][0].panToLevel(this.builtin[this.base].length,
                                        this.base);
  now = new Date();
  this.bonus = Math.max(1, Math.round(1000 / (now - this.last)));
  this.score += (this.builtin[this.base].length - 1) * this.bonus;
  this.last = now;
  this.available[slot] = this.addRandomFrom(this.hidden);
  if (this.available[slot]) {
    this.available[slot].panToSlot(slot,
                                   this.build.bind(this),
                                   this.canvas,
                                   this.context,
                                   this.image);
  }
  this.targetOffsetX = 50 * (6.5 - this.base * 2);
  this.targetOffsetY = 100 * Math.max(
    this.builtin[this.base].length + 2.5,
    5.5
  );
  restart = true;
  for (s = 0; s < this.available.length; s += 1) {
    if (this.available[s]) {
      if (this.available[s].bottom === this.builtin[this.base][0].top) {
        return true;
      }
      restart = false;
    }
  }
  if (restart) {
    this.gameover = true;
    GJAPI.ScoreAdd(0, this.score, this.score + ' points');
    this.canvas.addEventListener('click', this);
  } else {
    this.base += 1;
    this.builtin[this.base] = [];
  }
};
