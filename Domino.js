var Domino = function (context, image, top, bottom) {
  'use strict';
  this.context = context;
  this.image = image;
  this.top = top;
  this.bottom = bottom;
  this.width = 96;
  this.height = 192;
  this.x = 0;
  this.y = 0;
};

Domino.prototype.draw = function (type) {
  'use strict';
  this.context.drawImage(this.image,
                         this.top * this.width,
                         this.height * type / 2,
                         this.width,
                         this.height / 2,
                         this.x,
                         this.y,
                         this.width,
                         this.height / 2);
  this.context.drawImage(this.image,
                         this.bottom * this.width,
                         this.height * type / 2,
                         this.width,
                         this.height / 2,
                         this.x,
                         this.y + this.height / 2,
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
  if (this.handler &&
      e.offsetX > this.x && e.offsetX < this.x + this.width &&
      e.offsetY > this.y && e.offsetY < this.y + this.height) {
    this.handler(this.id);
  }
};

Domino.prototype.setTo = function (id, handler, canvas) {
  'use strict';
  this.targetX = (this.width + 4) * id + 2;
  this.targetY = 2;
  this.id = id;
  this.handler = handler;
  canvas.addEventListener('click', this.handle.bind(this));
};
