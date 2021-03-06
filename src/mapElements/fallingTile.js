define(['Phaser', 'game', ], function (Phaser, game) {
    
    /**
    Crea un objeto FallingTile con los siguientes parametros:
    @param coordenadaX, coordenadaY posicion del sprite en el mapa.
    @param nombreSprite nombre del sprite que se le va a asignar.
    @param hasFallen indica si la baldosa ya ha caido o aun se mantiene en el suelo. Si ha caido se mostrara un sprite del suelo abierto.
    */
    function FallingTile(coordenadaX, coordenadaY, nombreSprite, hasFallen) {
        this.collision = game.add.sprite(25, 25, 'collisionFallingTile');
        this.collision.sprite = game.add.sprite(coordenadaX, coordenadaY, nombreSprite);
        game.physics.enable(this.collision.sprite, Phaser.Physics.ARCADE);
        game.physics.enable(this.collision, Phaser.Physics.ARCADE);
        this.collision.sprite.animations.add('fall', [0,0,0,0,1,1,1,2,2,3,3], 7, true);
        this.collision.sprite.animations.add('fallRobot', [4,4,4,5,5,6,6,7,7,8,8,3], 7, true);
        this.collision.anchor.setTo(0.5,0.5);
        this.collision.sprite.addChild(this.collision);
        this.collision.hasFallen = hasFallen;
        if (hasFallen)
            this.collision.sprite.frame = 3;
        else
            this.collision.sprite.frame = 0;
    }

    /**
    Define el comportamiento ante una colision. Si la baldosa no ha caido (hasFallen es false) esta caera y hasFallen ira a true, y si ya ha caido entonces el jugador morira al caer al vacio.
    @param player jugador principal.
    @param tile baldosa o FallingTile.
    */
    FallingTile.prototype.collisionFallingTile = function(player, tile) {
        if (tile.hasFallen) {
            game.player.sprite.kill();
            tile.sprite.animations.play('fallRobot');
            game.time.events.add(Phaser.Timer.SECOND*1.5 , function() {
                game.musicNormal.stop();
                game.musicDark.stop();
                game.musicNormal.destroy();
                game.musicDark.destroy();
                game.inDarkDimension = false;
                game.state.start('dead');
            });
            return;
        }
        else {
            game.time.events.add(Phaser.Timer.SECOND*0.2 , function() {
                tile.sprite.animations.play('fall');
                game.time.events.add(Phaser.Timer.SECOND , function() {
                    tile.hasFallen = true;
                    tile.sprite.animations.stop('fall');
                    tile.sprite.frame = 3;
                });
            });
        }
    }
    
    return FallingTile;
});
