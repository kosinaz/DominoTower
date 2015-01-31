var DT = {};
DT.init = function () {
  'use strict';
  var i, j;
  DT.ctx = document.getElementById('dt').getContext('2d');
  DT.ctx.font = '50px Georgia';
  DT.ctx.textBaseline = 'bottom';
  DT.ctx.fillStyle = '#fff';
  DT.img = document.getElementById('img');
  DT.dom = [];
  for (i = 0; i < 6; i += 1) {
    for (j = 0; j < 6; j += 1) {
      DT.dom.push([i, j]);
    }
  }
  DT.out = [];
  for (i = 0; i < 6; i += 1) {
    DT.out.push(DT.dom.splice(Math.floor(Math.random() * DT.dom.length), 1)[0]);
  }
  DT.tow = [];
  DT.tow.push(DT.dom.splice(Math.floor(Math.random() * DT.dom.length), 1)[0]);
  DT.ctx.strokeText(DT.tow.length, 0, 208);
  DT.ctx.drawImage(DT.img, DT.tow[DT.tow.length - 1][0] * 50,
                   0, 50, 52, 130, 208, 50, 52);
  DT.ctx.drawImage(DT.img, DT.tow[DT.tow.length - 1][1] * 50,
                   0, 50, 50, 130, 260, 50, 50);
  for (i = 0; i < 6; i += 1) {
    DT.ctx.drawImage(DT.img, DT.out[i][0] * 50, 0, 50, 52, i * 52, 0, 50, 52);
    DT.ctx.drawImage(DT.img, DT.out[i][1] * 50, 0, 50, 50, i * 52, 52, 50, 50);
  }
  window.addEventListener('click', this.build);
};

DT.build = function (e) {
  'use strict';
  var i = Math.floor(e.offsetX / 52);
  if (DT.out[i][1] === DT.tow[DT.tow.length - 1][0]) {
    DT.tow.push(DT.out[i]);
    DT.out[i] = DT.dom.splice(Math.floor(Math.random() * DT.dom.length), 1)[0];
    DT.ctx.drawImage(DT.img, DT.out[i][0] * 50, 0, 50, 52, i * 52, 0, 50, 52);
    DT.ctx.drawImage(DT.img, DT.out[i][1] * 50, 0, 50, 50, i * 52, 52, 50, 50);
    DT.ctx.drawImage(DT.img, DT.tow[DT.tow.length - 1][0] * 50,
                     0, 50, 52, 130, 208, 50, 52);
    DT.ctx.drawImage(DT.img, DT.tow[DT.tow.length - 1][1] * 50,
                     0, 50, 50, 130, 260, 50, 50);
    DT.ctx.fillRect(0, 156, 50, 52);
    DT.ctx.strokeText(DT.tow.length, 0, 208);
  }
};
