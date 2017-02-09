define(['Phaser', 'game'], function (Phaser, game) {
    
    /**
    Objeto que representa el objetivo del juego. Se crea con la posicion en forma de coordenada x e y
    y el nombre del sprite. Ademas se inicia la animacion.
    */
    function Goal(coordenadaX, coordenadaY, nameSprite) {
        this.sprite = game.add.sprite(coordenadaX, coordenadaY, nameSprite);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.visible = true;
        this.sprite.animations.add('levitate', [0,1,2,3], 10, true);
        this.sprite.animations.play('levitate');
    }

    /**
    Callback de colision entre el jugador y el objto. Termina con la musica del juego y nos envia al estado win.
    */
    Goal.prototype.collisionGoal = function (player, goal) {
        game.musicNormal.stop();
        game.musicDark.stop();
        game.musicNormal.destroy();
        game.musicDark.destroy();
        game.state.start('win');
    }
    
    return Goal;
});