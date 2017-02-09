// Clase de la que depende
define(['Phaser', 'game', '/../mapElements/lives'], function (Phaser, game, lives) {
    
    /*
    Creamos el jugador en la posicion de inicio especificada y sus atributos.
    - sprite: sprite del robot.
    - lives : consultar la clase de mapElements 'lives'
    - animating: flag para que el jugador no pierda todas las vidas al colisionar con un enemigo
    - isMoving: flag para que el jugador solo se pueda mover en una direccion y no en diagonal
    - collision: al igual que en el monstruo es un sprite que permite 'afinar' las colisiones entre los elementos y el robot
    - tweenHurt: tween que hace que el jugador parpadee cuando le hacen dano.
    */
    function player(inicioX, inicioY) {
        this.sprite = game.add.sprite(inicioX, inicioY, 'robot');
        this.sprite.anchor.setTo(.5,.5);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.animations.add('up', [17,26], 10, true);
        this.sprite.animations.add('down', [3,4], 10, true);
        this.sprite.animations.add('left', [12,13], 10, true);
        this.sprite.animations.add('right', [21,22], 10, true);
        this.sprite.animations.add('changeDim', [27,28,29,27,28,29,27,28,29,30,0], 10, false);
        this.sprite.animations.add('fall', [31,31,32,32,33,33,34,34], 10, false);
        this.sprite.animations.add('damaged', [31,32,31,32,31,32,0], 10, false);
        this.sprite.animations.add('stopped', [0,0,1,1,2,2,1,0,0,1,1,2,2,1,0,0,1,1,2,2,1,5,5,6,6,7,7,8,8,8,8,8], 10, true);
        this.sprite.animations.add('stoppedLeft', [9,9,10,10,11,11,10], 10, true);
        this.sprite.animations.add('stoppedRight', [18,18,19,19,20,20,19], 10, true);
        this.sprite.animations.add('stoppedUp', [14,14,15,15,16,16,15], 10, true);
        this.tweenHurt = game.add.tween(this.sprite).to({alpha: 0}, 100).to({alpha: 1}, 100).loop();
        this.animating = false;
        this.lives = new lives();
        this.isMoving = 'no';
        this.collision = game.add.sprite(0, 0, 'collisionRobot');
        this.collision.anchor.setTo(0.5,0.10);
        game.physics.enable(this.collision, Phaser.Physics.ARCADE);
        this.sprite.addChild(this.collision);
    }
    
    /*
    LLama a substractLive (metodo de la clase 'lives') y consulta el numero de vidas restantes del jugador:
    si el numero es 0 pasuamos la musica y ponemos el efecto 'dead'. Ademas paramos la animaxcion de dano del
    jugador (tweenHurt) y para asegurarnos ponemos el alpha del sprite a 1 de nuevo.
    */
    player.prototype.lessLives = function () {
        game.player.lives.substractLive();
        
        if (game.player.lives.numLives <= 0){
            game.musicNormal.stop();
            game.musicDark.stop();
            game.musicNormal.destroy();
            game.musicDark.destroy();
            game.deadSound.play();
            game.state.start('dead');
        }

        game.player.animating = false;
        game.player.tweenHurt.stop();
        game.player.tweenHurt = null;
        game.player.tweenHurt = game.add.tween(game.player.sprite).to({alpha: 0}, 100).to({alpha: 1}, 100).loop();
        game.player.sprite.alpha = 1;
    }
    
    /*
    LLama a lives.addLive, que anade una vida al jugador.
    */
    player.prototype.liveUp = function () {
        game.blipSound.play();
        game.player.lives.addLive();
    }
    
    /*
    Dependiendo de la flecha que se este pulsando mueve al jugador en una direccion u otra.
    - cursors: es la variable que contiene la informacion del cursor pulsado.
    */
    player.prototype.move = function (cursors) {

        if (cursors.left.isDown && (this.isMoving == 'left' || this.isMoving == 'no')) {
            this.isMoving = 'left';
            this.sprite.body.velocity.x = -350;
            this.sprite.animations.play('left');
            this.facing = 'left';
        } else if (cursors.right.isDown && (this.isMoving == 'right' || this.isMoving == 'no')) {
            this.isMoving = 'right';
            this.sprite.body.velocity.x = 350;
            this.sprite.animations.play('right');
            this.facing = 'right';
        } else if (cursors.down.isDown && (this.isMoving == 'down' || this.isMoving == 'no')) {
            this.isMoving = 'down';
            this.sprite.body.velocity.y = 350;
            this.sprite.animations.play('down');
            this.facing = 'down';
        } else if (cursors.up.isDown && (this.isMoving == 'up' || this.isMoving == 'no')) {
            this.isMoving = 'up';
            this.sprite.body.velocity.y = -350;
            this.sprite.animations.play('up');
            this.facing = 'up';
        } else {
            if (this.facing == 'down' && this.animating == false) {
                this.sprite.animations.play('stopped');
            } else if (this.facing == 'left' && this.animating == false) {
                this.sprite.animations.play('stoppedLeft');
            } else if (this.facing == 'right' && this.animating == false) {
                this.sprite.animations.play('stoppedRight');
            } else if (this.facing == 'up' && this.animating == false) {
                this.sprite.animations.play('stoppedUp');
            }
            if (this.isMoving != 'trapFloor'){
                this.stopVel()
            }
        }

    } 
    
    /*
    Recoloca al jugador en la posicion especificada.
    Tambien cambiamos la flag inDarkDimension que nos permite controlar si estamos en una dimension u ptra
    y poner la musica adecuada, la luz y al monstruo.
    */
    player.prototype.teleport = function () {
        game.player.sprite.position.x = game.player.dstX;
        game.player.sprite.position.y = game.player.dstY;
        game.player.animating = false;
        game.teleport = false;
        if (!game.inDarkDimension) {
            game.musicNormal.stop();
            game.musicDark.play();
        } else {
            game.musicDark.stop();
            game.musicNormal.play();        
        }
        game.inDarkDimension = !game.inDarkDimension;
        game.changeDimSound.play(); 
    }
    
    /*
    Frena al jugador.
    */
    player.prototype.stopVel = function () {
        game.player.sprite.body.velocity.x = 0;
        game.player.sprite.body.velocity.y = 0;
        game.player.isMoving = 'no';
    }
    
    return player;
    
});
