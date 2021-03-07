// Clase de la que depende
define(['Phaser', 'game'], function (Phaser, game) {
    
    /**
    Crea un vortice dimensional en las coordenadas especificadas e inicializa la posicion a la que
    teletransporta el vortice (dstX y dstY)
    */
    function vortice(coordenadaX, coordenadaY, dstX, dstY) {
        vortice = game.add.tileSprite(coordenadaX, coordenadaY, 50, 70, 'vorticeDark');
        vortice.animations.add('anim_vortice');
        vortice.animations.play('anim_vortice', 6, true); // 6 frames
        game.physics.enable(vortice, Phaser.Physics.ARCADE);
        vortice.body.moves = false;
        vortice.dstX = dstX;
        vortice.dstY = dstY;  
        this.vortice = vortice;
    }
    
    /**
    Inicializa las variables necesarias para el teletransporte e invoca al metodo teleport de player despues de 0.7 segundos
    para que de timepo a ejecutar la animacion de teletransporte
    */
    vortice.prototype.collisionVorticeDark = function (player, vortice) {
        if (game.spaceKey.isDown && game.player.animating == false) {
            game.teleport = true;
            game.player.animating = true;
            game.player.sprite.animations.play('changeDim');
            game.player.dstX = vortice.dstX;
            game.player.dstY = vortice.dstY;
            game.time.events.add(Phaser.Timer.SECOND * 0.7, game.player.teleport);
        }
    }

    return vortice;
});
