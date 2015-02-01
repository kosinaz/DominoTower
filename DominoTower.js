/*global Domino*/
var DominoTower = function (canvas, image) {
  'use strict';
  var top, bottom, slot;
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  this.context.font = '100px Georgia';
  this.context.textBaseline = 'bottom';
  this.image = image;
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
  this.builtin = [];
  this.score = 0;
  window.setInterval(this.update.bind(this), 20);
  window.setInterval(this.draw.bind(this), 20);
};

DominoTower.prototype.update = function () {
  'use strict';
  var slot, level;
  for (slot = 0; slot < this.available.length; slot += 1) {
    this.available[slot].update();
  }
  for (level = 0; level < this.builtin.length; level += 1) {
    if (this.builtin[level]) {
      this.builtin[level].offsetY =
        this.builtin[level].height * (this.builtin.length + 2);
      this.builtin[level].update();
    }
  }
};

DominoTower.prototype.draw = function () {
  'use strict';
  var slot, level;
  this.context.fillRect(0, 0, 1600, 1600);
  this.context.drawImage(this.image, 0, 200, 600, 600, 0, 0, 600, 600);
  for (slot = 0; slot < this.available.length; slot += 1) {
    if (this.builtin[0] &&
        this.available[slot].bottom === this.builtin[0].top) {
      this.available[slot].draw(1);
    } else {
      this.available[slot].draw(0);
    }
  }
  for (level = 0; level < this.builtin.length; level += 1) {
    if (this.builtin[level]) {
      this.builtin[level].draw(1);
    }
  }
  this.context.fillText(this.score, 10, 600);
};

DominoTower.prototype.addRandomFrom = function (array) {
  'use strict';
  return array.splice(Math.floor(Math.random() * array.length), 1)[0];
};

DominoTower.prototype.build = function (slot) {
  'use strict';
  if (this.builtin[0] &&
      this.available[slot].bottom !== this.builtin[0].top) {
    return false;
  }
  this.builtin.unshift(this.available[slot]);
  this.builtin[0].x = (this.builtin[0].width + 4) * (slot - 2.5) + 2;
  this.builtin[0].y = this.builtin[0].height * (-this.builtin.length - 2);
  this.builtin[0].panToLevel(this.builtin.length, 0);
  this.available[slot] = this.addRandomFrom(this.hidden);
  this.available[slot].panToSlot(slot,
                                 this.build.bind(this),
                                 this.canvas,
                                 this.context,
                                 this.image);
  this.score += this.builtin.length;
};
