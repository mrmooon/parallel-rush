define(['Phaser', 'game'], function (Phaser, game) {
    
    /**
    El atributo numLves de la clase es el numero de vidas del jugador. Al comienzo es 3, el maximo de vidas posibles.
    */
    function lives() {
        /*this.livesSprite = game.add.tileSprite(20, 20, 228, 70, 'lives');
        this.livesSprite.fixedToCamera = true;
        this.livesSprite.scale.setTo(.7,.7);*/
        this.numLives = 3;
    }
    
    /**
    Resta 1 el valor de las vidas del jugador.
    */
    lives.prototype.substractLive = function() {
        this.numLives -= 1;
        this.livesSprite.width -= 76;
    }
    
    /**
    Suma 1 el valor de las vidas del jugador.
    */
    lives.prototype.addLive = function() {
        this.numLives += 1;
        this.livesSprite.width += 76;
    }
    
    return lives;
});
