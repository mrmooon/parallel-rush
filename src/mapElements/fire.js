// Clase de la que depende
define(['Phaser', 'game'], function (Phaser, game) {
    
    /**
    Crea un objeto de fuego con los parametros indicados
    @param coordenadaX, coordenadaY: posicion de inicio del sprite
    @param numX, numY: numero de llamas en el eje X y en el Y
    */
    function fire(coordenadaX, coordenadaY, numX, numY) {
        this.llamas = game.add.tileSprite(coordenadaX, coordenadaY, numX, numY, 'llamas');
        this.llamas.animations.add('anim_llamas');
        this.llamas.animations.play('anim_llamas', 6, true);// 6 frames
        game.physics.enable(this.llamas, Phaser.Physics.ARCADE);
        this.llamas.body.moves = false;
    }
    
    /**
    El metodo al que se invoca cuando colisiona el fuego con el jugador. Funciona igual que droid.collisionDroid
    */
    fire.prototype.collisionFire = function() {
        if (game.player.animating == false){
            game.player.tweenHurt.start();
            game.player.animating = true;
            game.time.events.add(Phaser.Timer.SECOND*1.5, game.player.lessLives);
        }
    }

    return fire;
});
