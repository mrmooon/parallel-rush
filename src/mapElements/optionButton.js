define(['Phaser', 'game'], function (Phaser, game) {
    
    /**
    Crea un boton de opcion (restart o quit). Como parametro tiene las coordenadas en las que esta
    el nombre del sprite para distinguir el quit del restart y el estado (nivel: play, pla2, play3)
    en el que estamos. Esto ultimo es necesario para reiniciar el nivel en el correspondiente.
    */
    function optionButton(coordenadaX, coordenadaY, nombre, stateName) {
        this.sprite = game.add.button(coordenadaX, coordenadaY, nombre, this.buttonRestart, this);
        this.name = nombre;
        this.sprite.scale.setTo(.7,.7);
        this.sprite.input.useHandCursor = true;
        this.sprite.fixedToCamera = true;
        this.stateName = stateName;
    }
    
    /**
    Reinicia el nivel, termina con todas las canciones e invoca al metodo create del nivel correspondiente.
    */
    optionButton.prototype.buttonRestart = function() {
        game.musicNormal.stop();
        game.musicDark.stop();
        game.musicNormal.destroy();
        game.musicDark.destroy();
        game.inDarkDimension = false;
        if (this.name == 'restart')
            game.state.start(this.stateName, true, false);
        else
            game.state.start('menu', true, false);
    }
    
    return optionButton;
});
