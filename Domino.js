var Domino = function (top, bottom) {
  'use strict';
  this.top = top;
  this.bottom = bottom;
  this.width = 96;
  this.height = 192;
  this.x = 0;
  this.y = 0;
  this.offsetX = 0;
  this.offsetY = 0;
  this.targetX = 0;
  this.targetY = 0;
  this.slot = null;
  this.handler = null;
  this.canvas = null;
  this.context = null;
  this.image = null;
};

Domino.prototype.draw = function (type) {
  'use strict';
  this.context.drawImage(this.image,
                         this.top * this.width,
                         this.height * type / 2,
                         this.width,
                         this.height / 2,
                         this.x + this.offsetX,
                         this.y + this.offsetY,
                         this.width,
                         this.height / 2);
  this.context.drawImage(this.image,
                         this.bottom * this.width,
                         this.height * type / 2,
                         this.width,
                         this.height / 2,
                         this.x + this.offsetX,
                         this.y + this.offsetY + this.height / 2,
                         this.width,
                         this.height / 2);
};

Domino.prototype.update = function () {
  'use strict';
  if (this.targetX > this.x + 4) {
    this.x += Math.floor((this.targetX - this.x) / 4);
  } else if (this.targetX < this.x - 4) {
    this.x -= Math.floor((this.x - this.targetX) / 4);
  } else {
    this.x = this.targetX;
  }
  if (this.targetY > this.y + 4) {
    this.y += Math.floor((this.targetY - this.y) / 4);
  } else if (this.targetY < this.y - 4) {
    this.y -= Math.floor((this.x - this.targetY) / 4);
  } else {
    this.y = this.targetY;
  }
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
  this.targetX = (this.width + 4) * this.slot + 2;
  this.targetY = 2;
  this.handler = handler || this.handler;
  this.canvas = canvas || this.canvas;
  this.context = context || this.context;
  this.image = image || this.image;
  this.canvas.addEventListener('click', this.handle.bind(this));
};

Domino.prototype.panToLevel = function (level, base) {
  'use strict';
  this.offsetX = (this.width + 4) * (2.5 + base) + 2;
  this.targetX = (this.width + 4) * base;
  this.targetY = this.height * -level;
  this.level = level;
};
