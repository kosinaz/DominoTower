/*global Domino*/
var DominoTower = function (canvas, image) {
  'use strict';
  var top, bottom, id;
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
  for (id = 0; id < 6; id += 1) {
    this.available.push(this.addRandomFrom(this.hidden));
    this.available[id].setTo(id,
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
  var id;
  for (id = 0; id < this.available.length; id += 1) {
    this.available[id].update();
  }
  for (id = 0; id < 2; id += 1) {
    if (this.builtin[id]) {
      this.builtin[id].update();
    }
  }
};

DominoTower.prototype.draw = function () {
  'use strict';
  var id;
  this.context.drawImage(this.image, 0, 200, 600, 600, 0, 0, 600, 600);
  for (id = 0; id < this.available.length; id += 1) {
    if (this.builtin[0] &&
        this.available[id].bottom === this.builtin[0].top) {
      this.available[id].draw(1);
    } else {
      this.available[id].draw(0);
    }
  }
  for (id = 0; id < 2; id += 1) {
    if (this.builtin[id]) {
      this.builtin[id].draw(1);
    }
  }
  this.context.fillText(this.score, 10, 600);
};

DominoTower.prototype.addRandomFrom = function (array) {
  'use strict';
  return array.splice(Math.floor(Math.random() * array.length), 1)[0];
};

DominoTower.prototype.build = function (id) {
  'use strict';
  if (this.builtin[0] &&
      this.available[id].bottom !== this.builtin[0].top) {
    return false;
  }
  this.builtin.unshift(this.available[id]);
  this.builtin[0].targetX = (this.available[id].width + 4) * 2.5 + 2;
  this.builtin[0].targetY = this.available[id].height * 2;
  this.available[id] = this.addRandomFrom(this.hidden);
  this.available[id].setTo(id,
                           this.build.bind(this),
                           this.canvas,
                           this.context,
                           this.image);
  if (this.builtin[1]) {
    this.builtin[1].targetY = this.builtin[1].height * 3;
  }
  this.score += this.builtin.length;
};
