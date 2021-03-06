define(['Phaser', 'game'], function (Phaser, game) {
    
    /**
    Crea un objeto Door con los siguientes parametros:
    @param coordenadaX, coordenadaY posicion del sprite en el mapa.
    @param namedoor define el tipo de puerta que se va a mostrar.
    */    
    function door(coordenadaX, coordenadaY, namedoor) {
        this.sprite = game.add.sprite(coordenadaX, coordenadaY, namedoor);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.animations.add('door_up', [3,2,1,0], 5, false);
        this.sprite.animations.add('door_down', [0,1,2,3], 5, false);
        this.sprite.body.moves = false;
        this.door_up = true;
    }
    
    /**
    Abre una puerta, reproduce su animacion y desactiva las colisiones.
    @param door puerta que va a bajar
    */
    door.prototype.doorDown = function (door) {
        door.door_up = false;
        door.sprite.animations.play('door_down');
        game.futDoorSound.play();
        game.time.events.add(Phaser.Timer.SECOND , function() {
            door.sprite.frame = 3;                             
        }, this.spikes);
    }

    /**
    Comprueba el estado de una puerta y desactiva las colisiones si esta bajada.
    @param door puerta a chequear
    */
    door.prototype.checkDoor = function (door) {
        if (door.door_up)
            game.physics.arcade.collide(door.sprite, game.player.sprite);            
        /*if (door.door_up) 
            door.sprite.frame = 0; 
        else  
            door.sprite.frame = 3;*/
    }
    
    return door;
});
