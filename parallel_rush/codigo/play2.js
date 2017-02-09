define(['Phaser', 'game', 'mapElements/fire', 'mapElements/spikes', 'mapElements/vortice', 'character/player.js', 'character/droid.js', 'character/monster.js', 'mapElements/optionButton', 'mapElements/button', 'mapElements/door', 'mapElements/directionFloor', 'mapElements/canon','mapElements/liveUp','mapElements/Goal','mapElements/fallingTile'], function (Phaser, game, fire, Spikes, vortice, player, droid, monster, optionButton, button, door, directionFloor, Canon, liveUp, Goal, FallingTile) {

    function playState2() { 
        Phaser.State.call(this);
    }
    
    //Inheritance
    playState2.prototype = Object.create(Phaser.State.prototype);
    playState2.prototype.constructor = playState2;

    playState2.prototype.create = function() {
        //Nombre del nivel actual
        game.currentLevel = 'play2';
        
        // Empezamos en la dimension normal
        game.inDarkDimension = false;
        
        // Motor de fisicas
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Fondo del juego
        fondoOscuro = game.add.tileSprite(0, 0, 800, 600, 'fondoOscuro');
        fondoOscuro.fixedToCamera = true;        
        
        this.lava = game.add.tileSprite(0, 0, 100*50, 30*50, 'magma');
        this.lava.animations.add('wave');
        this.lava.animations.play('wave', 5, true);
        
        // Crear el mapa
        this.map = game.add.tilemap('level2');
        this.map.addTilesetImage('groundTileset');

        this.floor = this.map.createLayer('floor');
        this.snow = this.map.createLayer('snow');
        this.walls = this.map.createLayer('walls');
        this.shadows = this.map.createLayer('shadows');
        this.collisions = this.map.createLayer('collisions');
                
        this.createLevel();
        
        // Capas
        this.map.setLayer(this.collisions)
        this.map.setCollisionByExclusion([]);
        
        this.floor.resizeWorld();
        this.collisions.resizeWorld();
        this.walls.resizeWorld();
        this.shadows.resizeWorld();
        
        game.physics.enable(this.collisions, Phaser.Physics.ARCADE);
        
        //Dark
        this.shadowTexture = game.add.bitmapData(game.width, game.height); // Create an object that will  use the bitmap as a texture
        this.lightSprite = game.add.image(game.camera.x, game.camera.y, this.shadowTexture);    // Set the blend mode to MULTIPLY. This will darken the colors of    // everything below this sprite.    
        this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
        
        // Creacion de los personajes: jugador y enemigos
        // A diferencia de los demás elementos del mapa el jugador es un atributo de game y no del nivel (play)
        
        // Player
        // game.player = new player(90*50, 5.5*50);
        game.player = new player(4*50, 4*50);
        game.camera.follow(game.player.sprite);
        
        // Controles para el juego
        game.cursors = game.input.keyboard.createCursorKeys();
        game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        // Musica
        game.musicNormal = game.add.audio('musicNormal');
        game.musicNormal.play();
        game.musicDark = game.add.audio('musicDark');
        game.deadSound = game.add.audio('deadSound');
        game.futDoorSound = game.add.audio('futuristic_door_sound');
        game.changeDimSound = game.add.audio('changeDimSound');
                
        //Se carga despues del jugador para que se superponga
        this.decoration = this.map.createLayer('decoration');
        this.decoration.resizeWorld();        
                
        //Lives
        game.player.lives.livesSprite = game.add.tileSprite(20, 20, 228, 70, 'lives');
        game.player.lives.livesSprite.fixedToCamera = true;
        game.player.lives.livesSprite.scale.setTo(.7,.7);
        
        for (i=0; i<5; i++) {
            emitter = game.add.emitter(i*250,0,500);
            emitter.makeParticles('snow_particle');
            emitter.setYSpeed(-100,100);
            emitter.setXSpeed(-100,100);
            emitter.start(false,10000,null,500);
        }

        // Auxiliary buttons
        // restart 
        this.restart = new optionButton(730, 20, 'restart', 'play2');
        // salir y volver al menu incial
        this.quit = new optionButton(730, 80, 'quit', 'play2');

    } // fin create

     playState2.prototype.update = function() {
        
        //Callbacks de colisiones 
        for (i in this.buttons){
            game.physics.arcade.overlap(this.buttons[i].sprite, game.player.collision, this.buttons[i].collisionButton);
            this.buttons[i].checkButton(this.buttons[i]);
        }
        /*
        if (!this.redButton.sprite.button_up) {
            this.llamas[1].llamas.kill();
        }
        if (!this.blueButton2.sprite.button_up) {
            this.llamas[0].llamas.kill();
        }
         
        for (i in this.buttonsMonster){
            game.physics.arcade.overlap(this.buttonsMonster[i].sprite, this.monster.sprite, this.buttonsMonster[i].collisionButton);
            this.buttonsMonster[i].checkButton(this.buttonsMonster[i]);
        }
        
        */for (i in this.vortices)
            game.physics.arcade.overlap(game.player.sprite, this.vortices[i].vortice, this.vortices[i].collisionVorticeDark);
        
        for (i in this.spikes.spikes)
            game.physics.arcade.overlap(game.player.collision, this.spikes.spikes[i], this.spikes.collisionSpikes);
        /*
        for (i in this.llamas)
            game.physics.arcade.overlap(game.player.collision, this.llamas[i].llamas, this.llamas[i].collisionFire);
         
        for (i in this.trapFloor)
            game.physics.arcade.overlap(game.player.collision, this.trapFloor[i].collision, this.trapFloor[i].impulse);
         
        for (i in this.healingObjs)
            game.physics.arcade.overlap(this.healingObjs[i].sprite, game.player.collision, this.healingObjs[i].collisionLiveUp);
        */
        for (i in this.fallingTiles)
            game.physics.arcade.overlap(game.player.collision, this.fallingTiles[i].collision, this.fallingTiles[i].collisionFallingTile);
        
        for (i in this.canons) {
            game.physics.arcade.overlap(game.player.sprite, this.canons[i].laser.bullets, this.canons[i].collisionBullet, null, this);
            game.physics.arcade.collide(this.canons[i].laser.bullets, this.collisions, function() {
                bullet = this.canons[i].laser.bullets.getFirstExists(true);
                bullet.kill();
            }, null, this);
        }
        
        for (i in this.droids) {
            game.physics.arcade.overlap(this.droids[i].sprite, game.player.collision, this.droids[i].collisionDroid);
            game.physics.arcade.collide(this.droids[i].sprite, this.collisions);
        }
        
        game.physics.arcade.collide(game.player.sprite, this.collisions);
        game.physics.arcade.overlap(game.player.sprite, this.monster.collision, this.monster.monsterKill);
        game.physics.arcade.overlap(game.player.sprite, this.goal.sprite, this.goal.collisionGoal);
        
        game.player.move(game.cursors);
        this.monster.move();
        
        // Visibilidad reducida en la dimension oscura
        if (game.inDarkDimension){
            this.lightSprite.reset(game.camera.x, game.camera.y);
            this.updateShadowTexture();
        }
         
    }//fin update
       
    playState2.prototype.createLevel = function(){

        //Falling Tiles --> hasFallen = true or false
        this.fallingTiles = new Array();
        for (i=7; i<=12; i++) { for (j=21.75; j<=21.75; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }
        for (i=14; i<=21; i++) { for (j=2.75; j<=5; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }
        for (i=73; i<=73; i++) { for (j=4.75; j<=5.75; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', true)); } }
        for (i=76; i<=76; i++) { for (j=4.75; j<=5.75; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', true)); } }
        for (i=74; i<=74; i++) { for (j=6.75; j<=6.75; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }
        for (i=75; i<=75; i++) { for (j=6.75; j<=6.75; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', true)); } }
        
        /*
        //cubrir una zona con animaciones de llamas
        this.llamas = new Array();
        // CoordenadaX, CordY, numero de llamas en horizontoal y en vertical
        this.llamas.push(new fire(19*50, 17*50, 1*50, 5*50));
        this.llamas.push(new fire(5*50, 10*50, 1*50, 5*50));
        */
        
        //Pinchos
        this.spikes = new Spikes();
        // coordenadaX, coordenadaY, numerode de filas, horizontal (true) y vertical (false)
        this.spikes.addSpike(24*50, 2.75*50, 3, false);
        this.spikes.addSpike(34*50, 2.75*50, 4, false);
        this.spikes.addSpike(62*50, 11.75*50, 2, true);
        game.time.events.add(Phaser.Timer.SECOND*2 , this.spikes.spikesUp, this.spikes);
        
        // Vortices
        this.vortices = new Array();
        //coordenadaX, coordenadaY, distancia a la que transporta en x y en y
        this.vortices.push(new vortice(5*50, 5*50, 5*50, (5+16)*50));
        this.vortices.push(new vortice(12*50, (5.5+16)*50, 12*50, 5.5*50));
        this.vortices.push(new vortice(53.5*50, 5.5*50, 53.5*50, (5.5+16)*50));
        this.vortices.push(new vortice(63.5*50, (2+16)*50, 63.5*50, 2*50));
        this.vortices.push(new vortice(74.5*50, 4*50, 74.5*50, (5+16)*50));
        this.vortices.push(new vortice(78*50, (5.5+16)*50, 78*50, 5.5*50));
        this.vortices.push(new vortice(90.5*50, 5.5*50, 89.5*50, (5.5+16)*50));
        
        //Buttons
        this.buttons = new Array();
        this.buttons.push(new button(74.5*50, 5*50, 'keyButton', 79*50, 4.5*50, 'key_door2'));
        
        // Droides
        this.droids = new Array();
        this.droids.push(new droid(47.25*50, 2*50, false, 'droidPurple'));
        this.droids.push(new droid(50.25*50, 6*50, false, 'droidRed'));
        this.droids.push(new droid(58*50, 12*50, true, 'droidBlue'));
        
        // Cañones
        this.canons = new Array();
        
        for (i=25.5; i<=31.5; i+=2)
            this.canons.push(new Canon(i*50,6.5*50, Phaser.ANGLE_UP));
        for (i=26.5; i<=32.5; i+=2)
            this.canons.push(new Canon(i*50,2.5*50, Phaser.ANGLE_DOWN));
        this.canons.push(new Canon(40.5*50,6.5*50, Phaser.ANGLE_UP));
        this.canons.push(new Canon(57.5*50,15.5*50, Phaser.ANGLE_RIGHT));
        this.canons.push(new Canon(57.5*50,17.5*50, Phaser.ANGLE_RIGHT));
        this.canons.push(new Canon(60.5*50,16.5*50, Phaser.ANGLE_LEFT));
        
        for (i in this.canons)
            this.canons[i].fire();
        
        // Monster
        this.monster = new monster(1*50, 20*50);/*

        // Trap floor
        this.trapFloor = new Array();
        for (i = 4; i <= 8; i++)
            this.trapFloor.push(new directionFloor (i*50, 3*50, 'floor_left'));
        /*this.trapFloor.push(new directionFloor (10*50, 19*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (9*50, 20*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (10*50, 20*50, 'floor_left'));
        
        // Objects which heal you
        this.healingObjs = new Array();
        this.healingObjs.push(new liveUp(15*50, 20*50, 'battery'));
        this.healingObjs.push(new liveUp(3*50, 21*50, 'battery'));*/

        this.goal = new Goal(90.5*50, 21.5*50, 'goal');
                          
    }
    
    playState2.prototype.updateShadowTexture =  function(){    // Draw shadow
        this.shadowTexture.context.fillStyle = 'rgb(50, 50, 50)';    
        this.shadowTexture.context.fillRect(0, 0, game.width, game.height);    
        var radius = 150 + game.rnd.integerInRange(1,10), heroX = game.player.sprite.x - game.camera.x, heroY = game.player.sprite.y - game.camera.y;       // Draw circle of light with a soft edge    
        var gradient = this.shadowTexture.context.createRadialGradient(heroX, heroY, 100 * 0.75, heroX, heroY, radius);   gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        this.shadowTexture.context.beginPath();
        this.shadowTexture.context.fillStyle = gradient;
        this.shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI*2, false);
        this.shadowTexture.context.fill();    // This just tells the engine it should update the texture cache
        this.shadowTexture.dirty = true;
    }
    
    playState2.prototype.winLevel = function(player, goal) {
        console.log('wiiiinnn!!!!');
        game.state.start('win');
    }

    return playState2;
        
});