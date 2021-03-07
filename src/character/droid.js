define(['Phaser', 'game'], function (Phaser, game) {
    
    /*
    Crea un droide utilizando la hoja de sprites dada en name. El droide tiene 
    un movimiento infinito en el eje X (horizontal = true) o en el Y (horizontal = false)
    rebotando en las paredes mas cercanas. Se colocoa en las coordenadas dadas coordenadaX
    y coordenadaY y se crean las animaciones.
    */
    function droid(coordenadaX, coordenadaY, horizontal, name) {
        this.sprite = game.add.sprite(coordenadaX, coordenadaY, name);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.animations.add('move', [0,1,2,3], 10, true);
        this.sprite.animations.add('explode', [6,4,5,6], 10, false);
        this.sprite.body.bounce.x = 1;
        this.sprite.animations.play('move');
        if (horizontal){
            this.sprite.body.velocity.x = 70;
            this.sprite.body.bounce.x = 1;
        } else {
            this.sprite.body.velocity.y = 70;
            this.sprite.body.bounce.y = 1;
        }
    }
    /*
    Método que se ejecutado cuando el robot y un droide colisionan. Se reproduce el tween de dano del robot
    y se invoca al metodo lessLives del mismo.
    */
    droid.prototype.collisionDroid = function() {
        if (game.player.animating == false){
            game.player.tweenHurt.start();
            game.player.animating = true;
            game.time.events.add(Phaser.Timer.SECOND*1.5, game.player.lessLives);
        }
    }

    return droid;
});
