var Domino = function (context, image, top, bottom) {
  'use strict';
  this.context = context;
  this.image = image;
  this.top = top;
  this.bottom = bottom;
  this.width = 96;
  this.height = 192;
};

Domino.prototype.draw = function () {
  'use strict';
  this.context.drawImage(this.image,
                         this.top * this.width,
                         0,
                         this.width,
                         this.height / 2,
                         this.x,
                         this.y,
                         this.width,
                         this.height / 2);
  this.context.drawImage(this.image,
                         this.bottom * this.width,
                         0,
                         this.width,
                         this.height / 2,
                         this.x,
                         this.y + this.height / 2,
                         this.width,
                         this.height / 2);
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
  this.x = (this.width + 4) * id + 2;
  this.y = 2;
  this.id = id;
  this.handler = handler;
  canvas.addEventListener('click', this.handle.bind(this));
};
