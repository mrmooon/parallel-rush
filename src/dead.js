define(['Phaser', 'game'], function (Phaser, game) {
    
    function deadState() {
        Phaser.State.call(this);
    }
    
    //Inheritance
    deadState.prototype = Object.create(Phaser.State.prototype);
    deadState.prototype.constructor = deadState; 
    
    deadState.prototype.create = function () {
        this.fondoMovil = game.add.tileSprite(0, 0, 800, 600, 'sky');
        this.fondoFijo = game.add.tileSprite(0, 0, 800, 600, 'mountains');
        
        var txt = game.add.sprite(0, -200, 'gameover');
        var tweenGameOver = game.add.tween(txt).to({y:0}, 1000).easing(Phaser.Easing.Bounce.Out).start();
        
        this.playButton = game.add.button(380, 320, 'playGame', this.start, this);
        this.playButton.input.useHandCursor = true;
        this.playButton.anchor.setTo(0.5,0.5);
        this.playButton.fixedToCamera = true;
        this.playButton.scale.setTo(0.5,0.5);

        this.playButton.onInputOver.add(this.tweenScale, this.playButton);
        this.playButton.onInputOut.add(this.tweeReScale, this.playButton);
        
        this.menuButton = game.add.button(380, 440, 'menuButton', this.menu, this);
        this.menuButton.input.useHandCursor = true;
        this.menuButton.fixedToCamera = true;
        this.menuButton.anchor.setTo(0.5,0.5);
        this.menuButton.scale.setTo(0.5,0.5);
        
        this.menuButton.onInputOver.add(this.tweenScale, this.menuButton);
        this.menuButton.onInputOut.add(this.tweeReScale, this.menuButton)
        
        
    }
    deadState.prototype.tweenScale = function (button) {
        game.add.tween(button.scale).to({x:0.7, y:0.7}, 300).start();
    }
    
    deadState.prototype.tweeReScale = function (button) {
        game.add.tween(button.scale).to({x:0.5, y:0.5}, 300).start();
    }
    
    deadState.prototype.start = function () {
        game.state.start(game.currentLevel);
    }
    
    deadState.prototype.menu = function(){
        game.state.start('menu');
    }
    
    deadState.prototype.update = function() {
        this.fondoMovil.tilePosition.x -= 0.5;
    }
    
    return deadState;
});