var miner1, cursors, facing, map, layer, dominos;

var playState = {

    create: function () {

        game.stage.backgroundColor = 0x19aeff;

        dominos = [];

        for (var i = 0; i < 6; i += 1) {
            dominos[i] = game.add.button(144 + i * 128, 32, '', this.put, this);
            var n = game.rnd.integerInRange(0, 5);
            dominos[i].addChild(game.make.image(0, 0, 'tiles', n)).data = n;
            n = game.rnd.integerInRange(0, 5);
            dominos[i].addChild(game.make.image(0, 96, 'tiles', n)).data = n;
            this.fly(dominos[i]);
        }
        game.world.setBounds(0, -9000, 10000, 9576);
        game.add.image(1024 / 2 - 64, 448, 'atlas', 'foundation.png');
        game.add.image(1024 / 2 - 64 + 192, 448, 'atlas', 'foundation.png');
        game.add.image(1024 / 2 - 64 + 192 * 2, 448, 'atlas', 'foundation.png');
        game.add.image(1024 / 2 - 64 + 192 * 3, 448, 'atlas', 'foundation.png');
        game.add.image(0, 448, 'atlas', 'hill.png');
        game.add.image(1024, 448, 'atlas', 'hill.png');
        game.top = 256;
        cursors = game.input.keyboard.createCursorKeys();
        game.next = -1;
        game.towers = 0;

       
    },
    
    put: function (domino) {
        if (game.next !== -1 && domino.children[1].data !== game.next) {
            return;
        }
        game.next = domino.children[0].data;
        var toPut = game.add.image(domino.x, domino.y, '');
        var n = domino.children[0].data;
        toPut.addChild(game.make.image(0, 0, 'tiles', n)).data = n;
        n = domino.children[1].data;
        toPut.addChild(game.make.image(0, 96, 'tiles', n)).data = n;
        domino.tweenX.stop();
        domino.tweenY.stop();
        var y = game.top - 416;
        domino.y = y - 192
        n = game.rnd.integerInRange(0, 5);
        domino.children[0].frame = domino.children[0].data = n;
        n = game.rnd.integerInRange(0, 5);
        domino.children[1].frame = domino.children[1].data = n;
        game.newTower = true;
        for (var i = 0; i < 6; i += 1) {
            if (dominos[i].children[1].data === game.next) {
                //dominos[i].children[1].frame += 6;
                game.newTower = false;
            }
        }
        for (i = 0; i < 6; i += 1) {
            dominos[i].inputEnabled = false;
            dominos[i].tweenX.stop();
            dominos[i].tweenY.stop();
            if (game.newTower) {
                game.add.tween(dominos[i]).to({
                    x: "+192",
                    y: 32
                }, 1000, Phaser.Easing.Cubic.Out, true).onComplete.add(this.fly);
            } else {
                game.add.tween(dominos[i]).to({
                    y: y
                }, 1000, Phaser.Easing.Cubic.Out, true).onComplete.add(this.fly);
            }
        }
        game.add.tween(toPut).to({
            x: 464 + game.towers * 192,
            y: game.top
        }, 200, Phaser.Easing.Cubic.In, true).onComplete.add(this.dust);
    
    },

    dust: function (domino) {

        var emitter;

        for (var i = 0; i < 3; i += 1) {
            emitter = game.add.emitter(
                domino.x + 16 + i * 32, 
                domino.y + 192, 
                8
            );
            emitter.gravity = 1000;
            emitter.makeParticles('atlas', 'dust.png');
            emitter.setAlpha(1, 0, 1000, Phaser.Easing.Cubic.Out);
            emitter.setScale(0.25, 1, 0.25, 1, 1000, Phaser.Easing.Cubic.Out);
            emitter.start(true, 1000, null, 10);
        }

        if (game.newTower) {
            game.next = -1;
            game.towers += 1;
            game.top = 256;
            game.add.tween(game.camera).to({
                x: "+192",
                y: 0
            }, 2000, Phaser.Easing.Cubic.Out, true);
        } else {
            game.top = domino.y - 192;
            game.add.tween(game.camera).to({
                y: "-192"
            }, 1000, Phaser.Easing.Cubic.Out, true);
        }
        
        
    },

    fly: function (domino) {
        domino.inputEnabled = true;
        domino.tweenY = game.add.tween(domino).to({
                y: '+8'
            },
            game.rnd.integerInRange(1000, 1500),
            Phaser.Easing.Quadratic.InOut,
            true,
            0, -1
        ).yoyo(true);
        domino.tweenX = game.add.tween(domino).to({
                x: '+4'
            },
            game.rnd.integerInRange(2000, 3000),
            Phaser.Easing.Quadratic.InOut,
            true,
            0, -1
        ).yoyo(true);
    },

    update: function () {

        if (cursors.up.isDown) {
            game.camera.y -= 10;
        } else if (cursors.down.isDown) {
            game.camera.y += 10;
        }
        if (cursors.left.isDown) {
            game.camera.x -= 10;
        } else if (cursors.right.isDown) {
            game.camera.x += 10;
        }

    }
}