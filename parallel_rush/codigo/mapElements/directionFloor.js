define(['Phaser', 'game', ], function (Phaser, game) {
    
    /**
    Crea una DirectionFloor con los siguientes parametros:
    @param coordenadaX, coordenadaY posicion del sprite en el mapa.
    @param nombreSprite nombre del sprite que se le va a asignar: floor_up, floor_down, floor_right, floor_left.
    Se añade un atributo tipo Phaser.Sprite para definir su colision con el jugador.
    */
    function directionFloor(coordenadaX, coordenadaY, nombreSprite) {
        this.sprite = game.add.sprite(coordenadaX, coordenadaY, nombreSprite);
        this.collision = game.add.sprite(25, 25, 'collisionFloor');
        this.collision.name = nombreSprite;
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        game.physics.enable(this.collision, Phaser.Physics.ARCADE);
        this.sprite.animations.add('point', [0,1], 5, true);
        this.sprite.animations.play('point');
        this.collision.anchor.setTo(0.5,0.5);
        this.sprite.addChild(this.collision);
    }
    
    /**
    Define el comportamiento ante una colision con el jugador, esto es mueve al jugador en la direction de la baldosa.
    @param player zona de colision del jugador.
    @param collision zona de colision del directionFloor.
    */
    directionFloor.prototype.impulse = function(player, collision) {
        console.log('Aquiiii');
        if ('floor_up' == collision.name && !(game.player.isMoving == 'trapFloor')){
            //console.log(game.player.isMoving);
            game.player.isMoving = 'trapFloor';
            game.player.sprite.body.velocity.x =0;
            game.player.sprite.body.velocity.y =-350;
            game.time.events.add(Phaser.Timer.SECOND*0.15 , game.player.stopVel);
        } else if ('floor_right' == collision.name && !(game.player.isMoving == 'trapFloor')){
            //console.log(game.player.isMoving);
            game.player.isMoving = 'trapFloor';
            game.player.sprite.body.velocity.x =350;
            game.player.sprite.body.velocity.y = 0;
            game.time.events.add(Phaser.Timer.SECOND*0.15 , game.player.stopVel);
        } else if ('floor_left' == collision.name && !(game.player.isMoving == 'trapFloor')){
            //console.log(game.player.isMoving);
            game.player.isMoving = 'trapFloor';
            game.player.sprite.body.velocity.x = -350;
            game.player.sprite.body.velocity.y = 0;
            game.time.events.add(Phaser.Timer.SECOND*0.15 , game.player.stopVel);
        } else if ('floor_down' == collision.name && !(game.player.isMoving == 'trapFloor')){
            //console.log(game.player.isMoving);
            game.player.isMoving = 'trapFloor';
            game.player.sprite.body.velocity.x =0;
            game.player.sprite.body.velocity.y =350;
            game.time.events.add(Phaser.Timer.SECOND*0.15 , game.player.stopVel);
        }
        
    }
    
    return directionFloor;
});
