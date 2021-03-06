define(['Phaser', 'game', 'cookies/cookieLevel'], function (Phaser, game, cookieLevel) {
    
    function menuState() {
        Phaser.State.call(this);
    }
    
    //Inheritance
    menuState.prototype = Object.create(Phaser.State.prototype);
    menuState.prototype.constructor = menuState; 
    
    menuState.prototype.create = function () {
        // Add a background image
        this.fondoMovil = game.add.tileSprite(0, 0, 800, 600, 'sky');
        this.fondoFijo = game.add.tileSprite(0, 0, 800, 600, 'mountains');
        game.add.image(0, 0, 'background');
        
        // Play (choose level)
        this.playButton = game.add.button(350, 200, 'playButton', this.start, this);
        this.playButton.input.useHandCursor = true;
        this.playButton.fixedToCamera = true;
        this.playButton.onInputOver.add(this.blink, this.playButton);
        this.playButton.onInputOut.add(this.stopBlink, this.playButton);
        
        // BOTÓN DE MUTE (SONIDO ON/OFF)
        this.muteButton = game.add.button(517, 352, 'mute', this.toggleSound, this);
        this.muteButton.input.useHandCursor = true;

        if (game.sound.mute) {
            this.muteButton.frame = 1;
        }
        
        game.currentLevel = 'play';

    }
    
    menuState.prototype.blink = function (button){
        button.tweenPlay = game.add.tween(button).to({alpha: 0.5}, 100).to({alpha: 1}, 300).loop().start();
    }
    
    menuState.prototype.stopBlink = function (button){
        button.alpha = 1;
        button.tweenPlay.stop();
    }
    
    menuState.prototype.start = function () {
        game.state.start('chooseLevel');
    }
    
    // FUNCIÓN PARA BOTONES DE MUTE/UNMUTE
    menuState.prototype.toggleSound =  function () {
        game.sound.mute = ! game.sound.mute;
        if (game.sound.mute) {
            this.muteButton.frame = 1;
        }
        else {
            this.muteButton.frame = 0;
        }
    }
    
    menuState.prototype.update = function() {
        this.fondoMovil.tilePosition.x -= 0.5;
    }

    
    return menuState;
});