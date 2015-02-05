var Domino = function (top, bottom) {
  'use strict';
  this.top = top;
  this.bottom = bottom;
  this.offsetX = 0;
  this.offsetY = 0;
  this.x = 0;
  this.y = 0;
  this.width = 100;
  this.height = 200;
  this.targetX = 0;
  this.targetY = 0;
  this.targetWidth = 100;
  this.targetHeight = 200;
  this.slot = null;
  this.handler = null;
  this.canvas = null;
  this.context = null;
  this.image = null;
};

Domino.prototype.draw = function (type) {
  'use strict';
  this.context.drawImage(this.image,
                         this.top * 100,
                         200 * (type === 2 ? 1 : type) / 2,
                         100,
                         100,
                         this.x + this.offsetX,
                         this.y + this.offsetY,
                         this.width,
                         this.height / 2);
  this.context.drawImage(this.image,
                         this.bottom * 100,
                         200 * type / 2,
                         100,
                         100,
                         this.x + this.offsetX,
                         this.y + this.offsetY + this.height / 2,
                         this.width,
                         this.height / 2);
};

Domino.prototype.update = function () {
  'use strict';
  this.x = this.getNext(this.x, this.targetX);
  this.y = this.getNext(this.y, this.targetY);
  this.width = this.getNext(this.width, this.targetWidth);
  this.height = this.getNext(this.height, this.targetHeight);
};

Domino.prototype.handle = function (e) {
  'use strict';
  var x, y;
  x = e.offsetX === undefined ? e.clientX - this.canvas.offsetLeft : e.offsetX;
  y = e.offsetX === undefined ? e.clientY - this.canvas.offsetTop : e.offsetY;
  if (this.handler &&
      x > this.x && x < this.x + this.width &&
      y > this.y && y < this.y + this.height) {
    this.handler(this.slot);
  }
};

Domino.prototype.panToSlot = function (slot, handler, canvas, context, image) {
  'use strict';
  this.slot = slot;
  this.targetX = this.width * this.slot;
  this.targetY = 0;
  this.handler = handler || this.handler;
  this.canvas = canvas || this.canvas;
  this.context = context || this.context;
  this.image = image || this.image;
  this.canvas.addEventListener('click', this.handle.bind(this));
};

Domino.prototype.panToLevel = function (level, base) {
  'use strict';
  this.targetX = 100 * base;
  this.targetY = 100 * -level;
  this.targetWidth = 50;
  this.targetHeight = 100;
  this.level = level;
};

Domino.prototype.getNext = function (from, to) {
  'use strict';
  if (to > from + 4) {
    return from + Math.floor((to - from) / 4);
  }
  if (to < from - 4) {
    return from - Math.floor((from - to) / 4);
  }
  return to;
};
