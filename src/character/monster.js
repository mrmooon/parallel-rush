// Clase de la que depende
define(['Phaser', 'game'], function (Phaser, game) {
    /*
    Crea el monstruo en las coordenadas dadas inicioX
    y inicioY y se crean las animaciones. Tambien se crea la zona 
    en la que el monstruo colisiona con el robot (no es todo el sprite del monstruo)
    */
    function monster(inicioX, inicioY) {
        this.coordInicioX = inicioX;
        this.coordInicioY = inicioY;
        this.sprite = game.add.sprite(inicioX, inicioY, 'monster');
        this.sprite.anchor.setTo(.5,.5);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        // Añadir todas las animaciones
        this.sprite.animations.add('monsterStoppedLeft', [0,1,2], 5, true);
        this.sprite.animations.add('monsterStoppedRight', [5,6,7], 5, true);
        this.sprite.scale.setTo(2,2);
        //Zona de colision
        this.collision = game.add.sprite(inicioX, inicioY, 'collisionMonster');
        this.collision.anchor.setTo(.5,.5);
        game.physics.enable(this.collision, Phaser.Physics.ARCADE);
        this.tweenMonster = game.add.tween(this.sprite).to({alpha: 0.5}, 1000).to({alpha: 1}, 1000).loop().start();
    }
    /*
    Mueve al monstruo. Para una explicacion mas detallada consultar la implementacion de la IA 
    en la memoria
    */
    monster.prototype.move = function () {
        if (game.inDarkDimension){
            if (game.player.sprite.position.x < this.collision.position.x) {
                this.sprite.body.velocity.x = -70;
                this.collision.body.velocity.x = -70;
                this.sprite.animations.play('monsterStoppedLeft');
            } if (game.player.sprite.position.x > this.collision.position.x) {
                this.sprite.body.velocity.x = 70;
                this.collision.body.velocity.x = 70;
                this.sprite.animations.play('monsterStoppedLeft');
            } if (game.player.sprite.position.y < this.collision.position.y) {
                this.sprite.body.velocity.y = -70;
                this.collision.body.velocity.y = -70;
                this.sprite.animations.play('monsterStoppedLeft');
            } if (game.player.sprite.position.y > this.collision.position.y) {
                this.sprite.body.velocity.y = 70;
                this.collision.body.velocity.y = 70;
                this.sprite.animations.play('monsterStoppedLeft');
            }
        } else {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            this.collision.body.velocity.x = 0;
            this.collision.body.velocity.y = 0;
            this.sprite.position.x = this.coordInicioX;
            this.sprite.position.y = this.coordInicioY;
            this.collision.position.x = this.coordInicioX;
            this.collision.position.y = this.coordInicioY;
        }
    }
    
    /*
    Se encarga de matar al personaje directamente poniendo su numero de vidas a 1
    y posteriormente llamando a player.lessLives.
    */
    monster.prototype.monsterKill = function () {
        if (game.teleport == false){
            game.player.lives.numLives = 1;
            game.player.lessLives();
        }
    }
    
    return monster;
    
});
