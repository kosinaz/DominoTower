/**
 * Create the game with a 1024*576 screen size.
 */ 
var game = new Phaser.Game(1024, 576, Phaser.AUTO, '');

/**
 * Create the game states.
 */ 
game.state.add('load', loadState, true);
game.state.add('play', playState);