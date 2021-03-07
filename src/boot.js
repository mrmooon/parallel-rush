// Clase de la que depende
define(['Phaser', 'game'], function (Phaser, game) {
    
    function bootState() {
        Phaser.State.call(this);
    }
    //Inheritance
    bootState.prototype = Object.create(Phaser.State.prototype);
    bootState.prototype.constructor = bootState; 
    
    /* download assets code here */
    bootState.prototype.preload = function () {
        // Load the image
        game.load.image('progressBar', 'assets/progressBar.png');
    }
    
    // Set some game settings
    bootState.prototype.create = function () {
        game.stage.backgroundColor = '#000000';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Start the load state
        game.state.start('load');
    }
    
    return bootState;
});
