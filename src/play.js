define(['Phaser', 'game', 'mapElements/fire', 'mapElements/spikes', 'mapElements/vortice', 'character/player.js', 'character/droid.js', 'character/monster.js', 'mapElements/optionButton', 'mapElements/button', 'mapElements/door', 'mapElements/directionFloor', 'mapElements/canon','mapElements/liveUp','mapElements/Goal','mapElements/fallingTile'], function (Phaser, game, fire, Spikes, vortice, player, droid, monster, optionButton, button, door, directionFloor, Canon, liveUp, Goal, FallingTile) {

    function playState() { 
        Phaser.State.call(this);
    }
    
    //Inheritance
    playState.prototype = Object.create(Phaser.State.prototype);
    playState.prototype.constructor = playState;

    playState.prototype.create = function() {
        //Nombre del nivel actual
        game.currentLevel = 'play';
        // Empezamos en la dimension normal
        game.inDarkDimension = false;
        
        // Motor de fisicas
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Fondo del juego
        fondoOscuro = game.add.tileSprite(0, 0, 800, 600, 'fondoOscuro');
        fondoOscuro.fixedToCamera = true;
        
        // Crear el mapa
        this.map = game.add.tilemap('level1');
        this.map.addTilesetImage('groundTileset');

        this.floor = this.map.createLayer('floor');
        this.snow = this.map.createLayer('snow');
        this.walls = this.map.createLayer('walls');
        this.shadows = this.map.createLayer('shadows');
        this.trees = this.map.createLayer('trees');
        this.collisions = this.map.createLayer('collisions');
        this.walls2 = this.map.createLayer('walls2');
        this.shadows2 = this.map.createLayer('shadows2');
                
        this.createLevel();
        
        // Capas
        this.map.setLayer(this.collisions)
        this.map.setCollisionByExclusion([]);
        
        this.floor.resizeWorld();
        this.collisions.resizeWorld();
        this.trees.resizeWorld();
        this.walls.resizeWorld();
        this.shadows.resizeWorld();
        this.walls2.resizeWorld();
        this.shadows2.resizeWorld();
        
        game.physics.enable(this.collisions, Phaser.Physics.ARCADE);
        
        //Dark
        this.shadowTexture = game.add.bitmapData(game.width, game.height); // Create an object that will  use the bitmap as a texture
        this.lightSprite = game.add.image(game.camera.x, game.camera.y, this.shadowTexture);    // Set the blend mode to MULTIPLY. This will darken the colors of    // everything below this sprite.    
        this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
        
        // Creacion de los personajes: jugador y enemigos
        // A diferencia de los demás elementos del mapa el jugador es un atributo de game y no del nivel (play)
        
        // Player
        game.player = new player(4*50, 4*50);
        //game.player = new player(25*50, 25*50);
        game.camera.follow(game.player.sprite);
            
        // Dialogos
        this.dialog1 = game.add.sprite(4.5*50, 3*50, 'dialog1');
        this.dialog2 = game.add.sprite(60*50, 4*50, 'dialog2');
        
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
        game.blipSound = game.add.audio('blipSound');
        game.blipSound = game.add.audio('blipSound');

                
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
        this.restart = new optionButton(730, 20, 'restart', 'play');
        // salir y volver al menu incial
        this.quit = new optionButton(730, 80, 'quit', 'play');
        
        for (i in this.canons)
            this.canons[i].fire();

    } // fin create

     playState.prototype.update = function() {

        //Callbacks de colisiones 
        for (i in this.buttons){
            game.physics.arcade.overlap(this.buttons[i].sprite, game.player.collision, this.buttons[i].collisionButton);
            this.buttons[i].checkButton(this.buttons[i]);
        }
        
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
        
        for (i in this.vortices)
            game.physics.arcade.overlap(game.player.sprite, this.vortices[i].vortice, this.vortices[i].collisionVorticeDark);
         
        for (i in this.spikes.spikes)
            game.physics.arcade.overlap(game.player.collision, this.spikes.spikes[i], this.spikes.collisionSpikes);
         
        for (i in this.llamas)
            game.physics.arcade.overlap(game.player.collision, this.llamas[i].llamas, this.llamas[i].collisionFire);
         
        for (i in this.trapFloor)
            game.physics.arcade.overlap(game.player.collision, this.trapFloor[i].collision, this.trapFloor[i].impulse);
         
        for (i in this.healingObjs)
            game.physics.arcade.overlap(this.healingObjs[i].sprite, game.player.collision, this.healingObjs[i].collisionLiveUp);
         
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
       
    playState.prototype.createLevel = function(){

        //Falling Tiles --> hasFallen = true or false
        this.fallingTiles = new Array();
        for (i=3; i<=3; i++) { for (j=25; j<=28; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', true)); } }
        for (i=7; i<=11; i++) { for (j=25; j<=25; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', true)); } }
        for (i=5; i<=11; i++) { for (j=26; j<=26; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', true)); } }
        for (i=5; i<=9; i++) { for (j=27; j<=27; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', true)); } }
        
        for (i=4; i<=7; i++) { for (j=25; j<=25; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }
        for (i=4; i<=4; i++) { for (j=26; j<=27; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }
        for (i=4; i<=9; i++) { for (j=28; j<=28; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }
        for (i=23; i<=31; i++) { for (j=25; j<=28; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }
        for (i=26; i<=28; i++) { for (j=22; j<=24; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }

        this.fallingTiles.push(new FallingTile(7*50, 24*50, 'fallingTile', true));
        this.fallingTiles.push(new FallingTile(8*50, 24*50, 'fallingTile', true));
        this.fallingTiles.push(new FallingTile(11*50, 28*50, 'fallingTile', true));

        //cubrir una zona con animaciones de llamas
        this.llamas = new Array();
        // CoordenadaX, CordY, numero de llamas en horizontoal y en vertical
        this.llamas.push(new fire(19*50, 17*50, 1*50, 5*50));
        this.llamas.push(new fire(5*50, 10*50, 1*50, 5*50));
        
        //pinchos
        this.spikes = new Spikes();
        // coordenadaX, coordenadaY, numerode de filas, horizontal (true) y vertical (false)
        this.spikes.addSpike(14*50, 11.6*50, 3, false);
        this.spikes.addSpike(12*50, 19.7*50, 2, true);
        this.spikes.addSpike(48*50, 25*50, 1, true);
        this.spikes.addSpike(55*50, 25*50, 3, false);
        this.spikes.addSpike(48*50, 27*50, 1, true);
        this.spikes.addSpike(49*50, 25*50, 3, false);        
        this.spikes.addSpike(3*50, 19*50, 2, true);
        
        this.spikes.addSpike(61*50, 8*50, 3, true);
        this.spikes.addSpike(61*50, 9*50, 3, true);        
        this.spikes.addSpike(51*50, 22*50, 3, true);
        this.spikes.addSpike(51*50, 23*50, 3, true);

        this.spikes.addSpike(14*50, 25*50, 4, false);
        this.spikes.addSpike(16*50, 25*50, 4, false);
        this.spikes.addSpike(18*50, 25*50, 4, false);
        game.time.events.add(Phaser.Timer.SECOND*2 , this.spikes.spikesUp, this.spikes);
        
        // Vortices
        this.vortices = new Array();
        //coordenadaX, coordenadaY, distancia a la que transporta en x y en y
        this.vortices.push(new vortice(14*50, 5.5*50, (14+45)*50, 5.5*50));
        this.vortices.push(new vortice((17+45)*50, 5*50, 17*50, 5*50));
        this.vortices.push(new vortice(8*50, 12.5*50, (8+45)*50, 12.5*50));
        this.vortices.push(new vortice((4+45)*50, 11*50, 4*50, 11*50));27
        this.vortices.push(new vortice(16.5*50, 14*50, (16.5+45)*50, 14*50));
        this.vortices.push(new vortice((20.5+45)*50, 14*50, 20.5*50, 14*50));
        this.vortices.push(new vortice((62+45)*50, 26*50, 62*50, 26*50));
        this.vortices.push(new vortice((15+45)*50, 27*50, 10*50, 13*50));
        this.vortices.push(new vortice(24*50, 26*50, (24+45)*50, 26.5*50));
        
        //Buttons
        this.buttons = new Array();
        this.redButton = new button(4*50, 12*50, 'red_button', 6*50, 8*50, 'futuristic_door')
        this.buttons.push(this.redButton);
        this.blueButton = new button(7*50, 5.2*50, 'blueButton', 12*50, 4.5*50, 'door');
        this.blueButton.sprite.visible = true;
        this.buttons.push(this.blueButton);
        this.buttons.push(new button((18.5+45)*50, 13.5*50, 'red_button', 16*50, 15*50, 'futuristic_door'));
        this.buttons.push(new button(48*50, 26*50, 'red_button', 57*50, 25.5*50, 'door'));
        this.blueButton2 = new button(4*50, 20*50, 'blueButton', 22*50, 18.5*50, 'door');
        this.buttons.push(this.blueButton2);
        this.buttons.push(new button(20.5*50, 26*50, 'red_button', 16*50, 22*50, 'futuristic_door'));
        this.buttons.push(new button(59*50, 25.5*50, 'keyButton', 12*50, 11.5*50, 'key_door2'));
        
        this.buttonsMonster = new Array();
        this.buttonsMonster.push(new button(72*50, 20*50, 'monsterButton', 71*50, 22*50, 'futuristic_door'));
        this.buttonsMonster.push(new button(52*50, 14*50, 'monsterButton', 51*50, 15*50, 'futuristic_door'));
        
        // Droides
        this.droids = new Array();
        this.droids.push(new droid(5*50, 7*50, false, 'droidPurple'));
        this.droids.push(new droid(10*50, 4*50, false, 'droidRed'));
        this.droids.push(new droid(3*50, 7*50, true, 'droidBlue'));
        this.droids.push(new droid(50*50, 18*50, false, 'droidPurple'));
        this.droids.push(new droid(54*50, 18*50, false, 'droidRed'));
        this.droids.push(new droid(48*50, 18*50, true, 'droidBlue'));
        this.droids.push(new droid(56*50, 19*50, true, 'droidBlue'));
        this.droids.push(new droid(48*50, 20*50, true, 'droidBlue'));
        this.droids.push(new droid(15*50, 25*50, false, 'droidPurple'));
        this.droids.push(new droid(19*50, 25*50, false, 'droidBlue'));
        
        // Cañones
        this.canons = new Array();
        this.canons.push(new Canon(16.5*50,7.5*50, Phaser.ANGLE_UP));
        this.canons.push(new Canon(13.5*50,7.5*50, Phaser.ANGLE_UP));
        
        this.canons.push(new Canon(15.5*50,10.5*50, Phaser.ANGLE_DOWN));
        this.canons.push(new Canon(19.5*50,10.5*50, Phaser.ANGLE_DOWN));

        this.canons.push(new Canon(3.5*50,25.5*50, Phaser.ANGLE_RIGHT));
        this.canons.push(new Canon(3.5*50,28.5*50, Phaser.ANGLE_RIGHT));
        
        this.canons.push(new Canon(72.5*50,28.5*50, Phaser.ANGLE_UP));
        this.canons.push(new Canon(76.5*50,25.5*50, Phaser.ANGLE_LEFT));
        this.canons.push(new Canon(68.5*50,27.5*50, Phaser.ANGLE_RIGHT));
        this.canons.push(new Canon(70.5*50,24.5*50, Phaser.ANGLE_DOWN));
        this.canons.push(new Canon(74.5*50,24.5*50, Phaser.ANGLE_DOWN));
        
        // Monster
        this.monster = new monster(62*50, 16*50);

        // Trap floor
        this.trapFloor = new Array();
        this.trapFloor.push(new directionFloor (9*50, 19*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (10*50, 19*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (9*50, 20*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (10*50, 20*50, 'floor_left'));
        
        this.trapFloor.push(new directionFloor (8*50, 18*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (9*50, 18*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (10*50, 18*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (11*50, 18*50, 'floor_down'));
        
        this.trapFloor.push(new directionFloor (8*50, 21*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (9*50, 21*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (10*50, 21*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (11*50, 21*50, 'floor_up'));
        
        this.trapFloor.push(new directionFloor (9*50, 19*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (10*50, 19*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (9*50, 20*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (10*50, 20*50, 'floor_left'));
        
        this.trapFloor.push(new directionFloor (7*50, 18*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (7*50, 19*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (7*50, 20*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (7*50, 21*50, 'floor_left'));
        
        this.trapFloor.push(new directionFloor (6*50, 18*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (6*50, 19*50, 'floor_up'));
        this.trapFloor.push(new directionFloor (6*50, 20*50, 'floor_down'));
        this.trapFloor.push(new directionFloor (6*50, 21*50, 'floor_down'));
        
        this.trapFloor.push(new directionFloor (4*50, 18*50, 'floor_left'));
        this.trapFloor.push(new directionFloor (3*50, 18*50, 'floor_down'));
        this.trapFloor.push(new directionFloor (5*50, 19*50, 'floor_up'));
        
        // Objects which heal you
        this.healingObjs = new Array();
        this.healingObjs.push(new liveUp(15*50, 20*50, 'battery'));
        this.healingObjs.push(new liveUp(3*50, 21*50, 'battery'));

        this.goal = new Goal((27+45)*50, 26*50, 'goal');
                          
    }
    
    playState.prototype.updateShadowTexture =  function(){    // Draw shadow
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
    
    playState.prototype.winLevel = function(player, goal) {
        console.log('wiiiinnn!!!!');
        game.state.start('win');
    }

    return playState;
        
});