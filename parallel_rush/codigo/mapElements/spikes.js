// Clase de la que depende
define(['Phaser', 'game'], function (Phaser, game) {
    
    /**
    Crea los Spikes (pinchos) como un array de spikes
    */
    function Spikes () {
        this.spikes = new Array();
    }
    
    /**
    Añade spikes al array de spikes teniendo en cuenta los siguientes parametros:
    @param coordenadaX, coordenadaY: posicion de inicio del sprite
    @param filas: cuantos sprites lo forman
    @param horizontal: el eje en el que se van a poner los spikes contiguios.
    Ademas se crean las animaciones que hacen que los pinchos suban y bajen.
    */
    Spikes.prototype.addSpike = function (coordenadaX, coordenadaY, filas, horizontal) {
         for (i=0; i<filas; i++){
             // Extendemos los pinchos en el eje Y
             if (!horizontal)
                spike = game.add.sprite(coordenadaX, (coordenadaY+(i*50)), 'spikes');
             // Extendemos los pinchos en el eje X
             else
                 spike = game.add.sprite((coordenadaX+(i*50)), coordenadaY, 'spikes');
             
            game.physics.enable(spike, Phaser.Physics.ARCADE);
            spike.animations.add('spikes_up', [0,1,2], 10, false);
            spike.animations.add('spikes_down', [2,1,0], 10, false);
            spike.body.moves = false;
            this.spikes.push(spike);
        }
    }
    
    /**
    Para todos los spikes del objeto de la clase sprite (solo se crea uno para todos los spikes de cada nivel)
    reprducimos la animacion spikes_up y ponemos un temporizador para que en dos segundos vuelvan a bajar.
    Tambien actualizamos la bandera spikesUp de game que nos permite saber si nos hara dano al pasar por encima de ellos.
    */
    Spikes.prototype.spikesUp = function () {
        for (idx in this.spikes) {
            this.spikes[idx].animations.play('spikes_up');
        }
        game.spikesUp = 1;
        game.time.events.add(Phaser.Timer.SECOND*2 , this.spikesDown, this);
    }
    
    /**
    Para todos los spikes del objeto de la clase sprite (solo se crea uno para todos los spikes de cada nivel)
    reprducimos la animacion spikes_down y ponemos un temporizador para que en dos segundos vuelvan a subir.
    Tambien actualizamos la bandera spikesUp de game que nos permite saber si nos hara dano al pasar por encima de ellos (1 hace dano, 0 no).
    */
    Spikes.prototype.spikesDown = function () {
         for (idx in this.spikes) {
            this.spikes[idx].animations.play('spikes_down');
        }
        game.spikesUp = 0;
        game.time.events.add(Phaser.Timer.SECOND*2 , this.spikesUp, this);
    }
    
    /**
    Colison entre el jugador y los pinchos, solo nos hace dano con la bandera a 1, funciona igual que todos los metodos que quitan vida (ver collisionDoid)
    */
    Spikes.prototype.collisionSpikes = function () {
       if (game.spikesUp == 1) 
           if (game.player.animating == false){
                game.player.tweenHurt.start();
                game.player.animating = true;
                game.time.events.add(Phaser.Timer.SECOND*1.5, game.player.lessLives);
            }
    }
    
    return Spikes;
});
