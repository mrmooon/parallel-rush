define(['Phaser', 'game'], function (Phaser, game) {
    
    /**
    Se corresponde con las baterias que vemos en el juego y nos suben vida.
    Creamos el sprite con los parametros correspondientes e iniciamos su animacion.
    Ademas incializamos la flag visible, que nos indica si ya hemos cogido la vida.
    */
    function liveUp(coordenadaX, coordenadaY, nameSprite) {
        this.sprite = game.add.sprite(coordenadaX, coordenadaY, nameSprite);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.visible = true;
        this.sprite.animations.add('levitate', [0,1,2,3,4,3,2,1], 10, true);
        this.sprite.animations.play('levitate');

    }
    
    /**
    Es el metodo de colision entre el sprite de la clase y el juegador. Si la flag visible esta activa y tenemos menos de 3 vidas, que es el maximo, llamamos a
    player.liveUp y hacemos invisible el sprite del objeto
    */
    liveUp.prototype.collisionLiveUp = function (liveUp, player) {
        if (liveUp.visible == true && game.player.lives.numLives < 3){
            game.player.liveUp();
            liveUp.visible = false;
            liveUp.alpha = 0;
        }
    }
    
    return liveUp;
});
