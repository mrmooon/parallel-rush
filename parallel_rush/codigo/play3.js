define(['Phaser', 'game', 'mapElements/fire', 'mapElements/spikes', 'mapElements/vortice', 'character/player.js', 'character/droid.js', 'character/monster.js', 'mapElements/optionButton', 'mapElements/button', 'mapElements/door', 'mapElements/directionFloor', 'mapElements/canon','mapElements/liveUp','mapElements/Goal','mapElements/fallingTile'], function (Phaser, game, fire, Spikes, vortice, player, droid, monster, optionButton, button, door, directionFloor, Canon, liveUp, Goal, FallingTile) {

    function play3State() { 
        Phaser.State.call(this);
    }
    
    //Inheritance
    play3State.prototype = Object.create(Phaser.State.prototype);
    play3State.prototype.constructor = play3State;

    play3State.prototype.create = function() {
        //Nombre del nivel actual
        game.currentLevel = 'play3';
        // Empezamos en la dimension normal
        game.inDarkDimension = false;
        
        // Motor de fisicas
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Fondo del juego
        fondoOscuro = game.add.tileSprite(0, 0, 800, 600, 'fondoOscuro');
        fondoOscuro.fixedToCamera = true;
        
        this.lava = game.add.tileSprite(0, 0, 150*50, 30*50*50, 'magma');
        this.lava.animations.add('wave');
        this.lava.animations.play('wave', 5, true);
        
        // Crear el mapa
        this.map = game.add.tilemap('level3');
        this.map.addTilesetImage('patrones');

        this.floor = this.map.createLayer('floor');
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
        game.player = new player(2.5*50, 6*50);
        //game.player = new player(11*50, 73*50);
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
        game.blipSound = game.add.audio('blipSound');

                
        //Se carga despues del jugador para que se superponga
        this.decoration = this.map.createLayer('decoration');
        this.decoration.resizeWorld();        
                
        //Lives
        game.player.lives.livesSprite = game.add.tileSprite(20, 20, 228, 70, 'lives');
        game.player.lives.livesSprite.fixedToCamera = true;
        game.player.lives.livesSprite.scale.setTo(.7,.7);
        
        // Auxiliary buttons
        // restart 
        this.restart = new optionButton(730, 20, 'restart', 'play3');
        // salir y volver al menu incial
        this.quit = new optionButton(730, 80, 'quit', 'play3');
        
        for (i in this.canons)
            this.canons[i].fire();

    } // fin create

     play3State.prototype.update = function() {

        //Callbacks de colisiones 
        for (i in this.buttons){
            game.physics.arcade.overlap(this.buttons[i].sprite, game.player.collision, this.buttons[i].collisionButton);
            this.buttons[i].checkButton(this.buttons[i]);
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
       
    play3State.prototype.createLevel = function(){

        //Falling Tiles --> hasFallen = true or false
        this.fallingTiles = new Array();
        
        for (i=15; i<=18; i++) { for (j=18; j<=23; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }
        for (i=13; i<=14; i++) { for (j=20; j<=23; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }
        for (i=26; i<=28; i++) { for (j=22; j<=26; j++) { this.fallingTiles.push(new FallingTile(i*50, j*50, 'fallingTile', false)); } }

        //cubrir una zona con animaciones de llamas
        this.llamas = new Array();
        // CoordenadaX, CordY, numero de llamas en horizontal y en vertical
        this.llamas.push(new fire(2*50, 3*50, 1*50, 1*50));
        this.llamas.push(new fire(2*50, 8*50, 1*50, 1*50));
        
        //pinchos
        this.spikes = new Spikes();
        // coordenadaX, coordenadaY, numerode de filas, horizontal (true) y vertical (false)
        this.spikes.addSpike(72*50, 31*50, 2, true);
        this.spikes.addSpike(72*50, 37*50, 2, true);
        this.spikes.addSpike(72*50, 43*50, 2, true);
        this.spikes.addSpike(72*50, 49*50, 2, true);

        this.spikes.addSpike(94*50, 38*50, 2, false);
        this.spikes.addSpike(86*50, 38*50, 2, false);

        game.time.events.add(Phaser.Timer.SECOND*2 , this.spikes.spikesUp, this.spikes);
        
        // Vortices
        this.vortices = new Array();
        //coordenadaX, coordenadaY, distancia a la que transporta en x y en y
        this.vortices.push(new vortice(30.5*50, 1.1*50, 67*50, 14*50));
        this.vortices.push(new vortice(67.5*50, 10*50,26.5*50, 6*50));
        this.vortices.push(new vortice(26.5*50, 12.5*50, 72.5*50, 26.5*50));
        this.vortices.push(new vortice(72*50, 53*50, 26.5*50, 17*50));
        this.vortices.push(new vortice(26.5*50, 29.5*50,80*50, 29*50));
        this.vortices.push(new vortice(114*50, 29*50, 11*50, 73*50));
        
        //Buttons
        this.buttons = new Array();
        this.buttons.push(new button(72*50, 18*50, 'red_button', 26*50, 7*50, 'futuristic_door'))
        this.buttons.push(new button(13*50, 18*50, 'blueButton', 26*50, 27*50, 'futuristic_door'))

        this.buttonsMonster = new Array();
        this.buttonsMonster.push(new button(100*50, 36*50, 'monsterButton', 85*50, 29*50, 'futuristic_door'));
        
        // Droides
        this.droids = new Array();
        this.droids.push(new droid(69*50, 18*50, false, 'droidRed'));
        this.droids.push(new droid(69*50, 12*50, true, 'droidBlue'));
        this.droids.push(new droid(72*50, 11*50, false, 'droidPurple'));
        this.droids.push(new droid(68*50, 15*50, true, 'droidRed'));
        this.droids.push(new droid(74*50, 17*50, false, 'droidBlue'));
        this.droids.push(new droid(72*50, 17*50, true, 'droidPurple'));
        this.droids.push(new droid(98*50, 38*50, false, 'droidPurple'));
        this.droids.push(new droid(102*50, 35*50, false, 'droidRed'));
        this.droids.push(new droid(98*50, 30*50, false, 'droidBlue'));
        this.droids.push(new droid(112*50, 29*50, true, 'droidPurple'));


        // Cañones
        this.canons = new Array();
        this.canons.push(new Canon(35.5*50,4*50, Phaser.ANGLE_LEFT));
        this.canons.push(new Canon(106*50, 28.5*50, Phaser.ANGLE_DOWN));
        this.canons.push(new Canon(92*50, 30.5*50, Phaser.ANGLE_UP));
        
        // Monster
        this.monster = new monster(73*50, 23*50);

         // Trap floor
        this.trapFloor = new Array();
        for (i = 3; i <= 8; i++){
            this.trapFloor.push(new directionFloor (i*50, 3*50, 'floor_left'));
            this.trapFloor.push(new directionFloor (i*50, 8*50, 'floor_left'));
        }

        this.trapFloor.push(new directionFloor (4*50, 4*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (5*50, 4*50, 'floor_up'));
        this.trapFloor.push(new directionFloor (6*50, 4*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (7*50, 4*50, 'floor_down'));
        this.trapFloor.push(new directionFloor (8*50, 4*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (4*50, 5*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (6*50, 5*50, 'floor_up'));
        this.trapFloor.push(new directionFloor (7*50, 5*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (8*50, 5*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (8*50, 6*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (6*50, 6*50, 'floor_up'));
        this.trapFloor.push(new directionFloor (5*50, 5*50, 'floor_down'));
        this.trapFloor.push(new directionFloor (5*50, 6*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (4*50, 6*50, 'floor_down'));
        this.trapFloor.push(new directionFloor (7*50, 6*50, 'floor_down'));
        this.trapFloor.push(new directionFloor (4*50, 7*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (7*50, 7*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (6*50, 7*50, 'floor_right'));
        this.trapFloor.push(new directionFloor (5*50, 7*50, 'floor_down'));
        this.trapFloor.push(new directionFloor (8*50, 7*50, 'floor_up'));

        for (i = 4; i < 8; i++)
            this.trapFloor.push(new directionFloor (3*50, i*50, 'floor_right'));
            
        // Objects which heal you
        this.healingObjs = new Array();
        this.healingObjs.push(new liveUp(27*50, 9.5*50, 'battery'));
        this.healingObjs.push(new liveUp(91*50, 38.5*50, 'battery'));


        this.goal = new Goal(10.5*50, 79*50, 'goal');
                          
    }
    
    play3State.prototype.updateShadowTexture =  function(){    // Draw shadow
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
    
    play3State.prototype.winLevel = function(player, goal) {
        console.log('wiiiinnn!!!!');
        game.state.start('win');
    }

    return play3State;
        
});