define(['Phaser', 'game', 'cookies/cookieLevel'], function (Phaser, game, cookieLevel) {
    
    function chooseLevelState() {
        Phaser.State.call(this);
    }
    
    //Inheritance
    chooseLevelState.prototype = Object.create(Phaser.State.prototype);
    chooseLevelState.prototype.constructor = chooseLevelState; 
    
    chooseLevelState.prototype.create = function () {
        game.cookie = new cookieLevel ();
        console.log(game.cookie.level);
        //  A simple background for our game
        this.fondoMovil = game.add.tileSprite(0, 0, 800, 600, 'sky');
        this.fondoFijo = game.add.tileSprite(0, 0, 800, 600, 'mountains');
        this.fondoFijo = game.add.tileSprite(0, 0, 800, 600, 'chooseLevelTitle');
        
        this.oneButton = game.add.button(250, 300, 'oneButton', this.chooseLevel1, this);
        this.oneButton.input.useHandCursor = true;
        this.oneButton.anchor.setTo(0.5,0.5);
        
        if(game.cookie.level >= 2){
            this.twoButton = game.add.button(400, 300, 'twoButton', this.chooseLevel2, this);
            this.twoButton.input.useHandCursor = true;
            this.twoButton.onInputOver.add(this.tweenScale2, this.twoButton);
            this.twoButton.onInputOut.add(this.tweeReScale2, this.twoButton);
            this.twoButton.anchor.setTo(0.5,0.5);

        } else {
            this.twoButton = game.add.sprite(400, 300, 'twoButton');
            this.candado = game.add.sprite(370, 270, 'candado');
            this.twoButton.anchor.setTo(0.5,0.5);
        }
        
        if(game.cookie.level >= 3){
            this.threeButton = game.add.button(550, 300, 'threeButton', this.chooseLevel3, this);
            this.threeButton.input.useHandCursor = true;
            this.threeButton.onInputOver.add(this.tweenScale2, this.threeButton);
            this.threeButton.onInputOut.add(this.tweeReScale2, this.threeButton);
            this.threeButton.anchor.setTo(0.5,0.5);

        } else {
            this.threeButton = game.add.sprite(550, 300, 'threeButton');
            this.candado = game.add.sprite(520, 270, 'candado');
            this.threeButton.anchor.setTo(0.5,0.5);
        }

        this.menuButton = game.add.button(400, 440, 'menuButton', this.menu, this);
        this.menuButton.input.useHandCursor = true;
        this.menuButton.fixedToCamera = true;
        this.menuButton.anchor.setTo(0.5,0.5);
        this.menuButton.scale.setTo(0.5,0.5);
        
        this.menuButton.onInputOver.add(this.tweenScale, this.menuButton);
        this.menuButton.onInputOut.add(this.tweeReScale, this.menuButton);
        
        this.oneButton.onInputOver.add(this.tweenScale2, this.oneButton);
        this.oneButton.onInputOut.add(this.tweeReScale2, this.oneButton);
       
        
    }
    
    chooseLevelState.prototype.update = function() {
        this.fondoMovil.tilePosition.x -= 0.5;
    }
    
    chooseLevelState.prototype.tweenScale = function (button) {
        game.add.tween(button.scale).to({x:0.7, y:0.7}, 300).start();
    }
    
    chooseLevelState.prototype.tweeReScale = function (button) {
        game.add.tween(button.scale).to({x:0.5, y:0.5}, 300).start();
    }
    
    chooseLevelState.prototype.tweenScale2 = function (button) {
        game.add.tween(button.scale).to({x:1.5, y:1.5}, 300).start();
    }
    
    chooseLevelState.prototype.tweeReScale2 = function (button) {
        game.add.tween(button.scale).to({x:1, y:1}, 300).start();
    }
    
    chooseLevelState.prototype.menu = function(){
        game.state.start('menu');
    }
    
    chooseLevelState.prototype.chooseLevel1 = function(){
        game.state.start('play');
    }
    
    chooseLevelState.prototype.chooseLevel2 = function(){
        game.state.start('play2');
    }
    
    chooseLevelState.prototype.chooseLevel3 = function(){
        game.state.start('play3');
    }
    
    return chooseLevelState;
});