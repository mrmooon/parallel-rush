define(['Phaser', 'game'], function (Phaser, game) {

    function loadState() { 
        Phaser.State.call(this);
    }
    
    //Inheritance
    loadState.prototype = Object.create(Phaser.State.prototype);
    loadState.prototype.constructor = loadState; 
    
    loadState.prototype.preload = function () {
        // Add a 'loading...' label on the screen
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...',{ font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        
        // Display the progress bar
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
                        
        //MENU
        game.load.image('background', 'assets/robot2.png'); //loadingScreen
        game.load.image('playButton', 'assets/playButton.png');
        game.load.image('gameover', 'assets/gameover.png');
        game.load.image('menuButton', 'assets/MENU.png');
        game.load.image('playGame', 'assets/playGame.png');
        game.load.image('chooseLevel', 'assets/chooseLevel.png');
        game.load.image('winBg', 'assets/winBackground.png');
        game.load.image('sky', 'assets/sky2.png');
        game.load.image('mountains', 'assets/montanas.png');
        game.load.image('oneButton', 'assets/oneButton.png');
        game.load.image('twoButton', 'assets/twoButton.png');
        game.load.image('threeButton', 'assets/threeButton.png');
        game.load.image('candado', 'assets/candado.png');

        game.load.image('chooseLevelTitle', 'assets/chooseLevelTitle.png');
        
        ////incluimos un spritesheet para el control del volumen (MUTE)
        game.load.spritesheet('mute', 'assets/muteButton.png', 26, 21.5);
        
        //Tiled Json
        game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'assets/level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level3', 'assets/level3.json', null, Phaser.Tilemap.TILED_JSON);

        
        // Fondo
        game.load.image('fondoOscuro', 'assets/fondo_oscuro.png');
        game.load.image('snow_particle', 'assets/snow_particle.png');
        // Ground
        game.load.image('groundTileset', 'assets/groundTileset.png');
        game.load.image('patrones', 'assets/groundTileset.png');

        // Elementos
        //Walls
        //Player
        game.load.spritesheet('robot','assets/robot.png', 40, 56);
        game.load.spritesheet('collisionRobot', 'assets/collisionMonster.png', 30, 25);
        game.load.spritesheet('droidPurple','assets/droidPurple.png', 30, 50);
        game.load.spritesheet('droidRed','assets/droidRed.png', 30, 50);
        game.load.spritesheet('droidBlue','assets/droidBlue.png', 30, 50);
        game.load.spritesheet('bombPurple','assets/bombPurple.png', 40, 45);
        game.load.spritesheet('bombRed','assets/bombRed.png', 40, 45);
        game.load.spritesheet('bombBlue','assets/bombBlue.png', 40, 45);
        game.load.spritesheet('monster','assets/monster.png', 57, 64);
        game.load.spritesheet('collisionMonster', 'assets/collisionMonster.png', 54, 60);
        game.load.spritesheet('battery','assets/battery.png', 13, 30);

        //Elementos animados
        game.load.spritesheet('llamas','assets/llamas.png', 50, 70);
        game.load.spritesheet('vorticeDark','assets/vortice_dark.png', 50, 70);
        game.load.spritesheet('spikes','assets/spikes.png', 50, 58);
        game.load.spritesheet('red_button','assets/red_button.png', 50, 58);
        game.load.spritesheet('blueButton','assets/blueButton.png', 50, 58);
        game.load.spritesheet('keyButton','assets/keyButton.png', 50, 58);
        game.load.spritesheet('monsterButton','assets/monsterButton.png', 50, 58);
        game.load.spritesheet('door','assets/door.png', 50, 125);
        game.load.spritesheet('futuristic_door','assets/futuristic_door.png', 150, 124);
        game.load.spritesheet('key_door','assets/key_door.png', 150, 124);
        game.load.spritesheet('key_door2','assets/key_door2.png', 50, 125);
        game.load.spritesheet('bullet','assets/bullet.png', 19, 19);
        game.load.spritesheet('canonUp','assets/canon.png', 50, 50);
        game.load.spritesheet('canonDown','assets/canonDown.png', 50, 50);
        game.load.spritesheet('canonLeft','assets/canonLeft.png', 50, 50);
        game.load.spritesheet('canonRight','assets/canonRight.png', 50, 50);
        game.load.spritesheet('floor_up', 'assets/directional_floor_2.png', 50, 50);
        game.load.spritesheet('floor_right', 'assets/directional_floor_right_2.png', 50, 50);
        game.load.spritesheet('floor_down', 'assets/directional_floor_down_2.png', 50, 50);
        game.load.spritesheet('floor_left', 'assets/directional_floor_left2.png', 50, 50);
        game.load.spritesheet('collisionFloor', 'assets/collisionMonster.png', 20, 20);
        game.load.spritesheet('fallingTile', 'assets/fallingTile.png', 50, 50);
        game.load.spritesheet('collisionFallingTile', 'assets/collisionMonster.png', 20, 20);
        game.load.spritesheet('goal', 'assets/goal.png', 50, 80);
        game.load.spritesheet('magma', 'assets/lava.png', 128, 128);
        
        //Menu de juego
        game.load.spritesheet('lives','assets/life.png', 76, 70);
        game.load.spritesheet('restart','assets/restart.png', 70, 70);
        game.load.spritesheet('quit','assets/quit.png', 70, 70);
        game.load.spritesheet('dialog1','assets/dialog1.png', 76, 70);
        game.load.spritesheet('dialog2','assets/dialog2.png', 76, 70);
        
        //Audio
        game.load.audio('musicNormal', ['assets/audio/dimensionGOOD.mp3']);
        game.load.audio('musicDark', ['assets/audio/dimensionDark.mp3']);
        game.load.audio('deadSound', ['assets/audio/deadSound.mp3']);
        game.load.audio('futuristic_door_sound', ['assets/audio/futuristic_door.mp3']);
        game.load.audio('changeDimSound', ['assets/audio/changeDim.mp3']);
        game.load.audio('blipSound', ['assets/audio/blip.wav']);

        
    }

    loadState.prototype.create = function() {
        // Go to the menu state
        game.state.start('menu');
    }
    
    return loadState;
});