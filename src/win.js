define(['Phaser', 'game', 'cookies/cookieLevel'], function (Phaser, game, cookieLevel) {
    
    function winState() {
        Phaser.State.call(this);
    }
    
    //Inheritance
    winState.prototype = Object.create(Phaser.State.prototype);
    winState.prototype.constructor = winState; 
    
    winState.prototype.create = function () {
        console.log(game.cookie.level);
        if (game.currentLevel == 'play' && game.cookie.level == 1)
            game.cookie.updateCookie(2);
        else if (game.currentLevel == 'play2' && game.cookie.level == 2)
            game.cookie.updateCookie(3);

        console.log(game.cookie.level);
        //  A simple background for our game
        this.fondoMovil = game.add.tileSprite(0, 0, 800, 600, 'sky');
        this.fondoFijo = game.add.tileSprite(0, 0, 800, 600, 'mountains');
        
        var txt = game.add.sprite(0, -200, 'winBg');
        var tweenGameOver = game.add.tween(txt).to({y:0}, 1500).easing(Phaser.Easing.Bounce.Out).start();
                
        this.menuButton = game.add.button(400, 440, 'chooseLevel', this.menu, this);
        this.menuButton.input.useHandCursor = true;
        this.menuButton.fixedToCamera = true;
        this.menuButton.anchor.setTo(0.5,0.5);
        this.menuButton.scale.setTo(0.8, 0.8);
        
        this.menuButton.onInputOver.add(this.tweenScale, this.menuButton);
        this.menuButton.onInputOut.add(this.tweeReScale, this.menuButton)
        
        this.sprite = game.add.sprite(400, 300, 'robot');
        this.sprite.anchor.setTo(.5,.5);
        this.sprite.scale.setTo(1.5, 1.5);
        this.sprite.animations.add('celebrate', [0,0,1,1,2,2,1,0,0,1,1,2,2,1,0,0,1,1,2,2,1,31,31,32,32,,33,33,34,34,35,35,34,34,35,35,34,34,35,35], 10, true);
        this.sprite.animations.play('celebrate');       
        
    }
    
    winState.prototype.update = function() {
        this.fondoMovil.tilePosition.x -= 0.5;
    }
    
    winState.prototype.tweenScale = function (button) {
        game.add.tween(button.scale).to({x:1, y:1}, 300).start();
    }
    
    winState.prototype.tweeReScale = function (button) {
        game.add.tween(button.scale).to({x:0.8, y:0.8}, 300).start();
    }
    
    winState.prototype.start = function () {
        game.state.start('play');
    }
    
    winState.prototype.menu = function(){
        game.state.start('chooseLevel');
    }
    
    return winState;
});