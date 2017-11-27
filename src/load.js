var loadState = {
    preload: function () {

        /**
         * Load the sprites.
         */ 
        game.load.spritesheet('tiles', 'assets/tiles.png', 96, 96);
        game.load.atlas('atlas', 'assets/atlas.png', 'data/atlas.json');

    },
    
    create: function () {

        /**
         * Start the game.
         */
        game.state.start('play');
    },
};