// Canon
define(['Phaser', 'game'], function (Phaser, game) {
    
    /**
    Crea un canon con los siguientes parametros:
    @param inicioX, inicioY posicion del sprite en el mapa
    @param dir direccion en la que dispara: Phaser.ANGLE_UP, Phaser.ANGLE_DOWN, Phaser.ANGLE_LEFT y Phaser.ANGLE_RIGHT.

    Ademas tiene un atributo laser, que representa la municion disparada.
    */
    function Canon(inicioX, inicioY, dir) {
        // Create Canon
        switch(dir){
            case Phaser.ANGLE_UP:       this.sprite = game.add.sprite(inicioX, inicioY, 'canonUp'); break;
            case Phaser.ANGLE_DOWN:     this.sprite = game.add.sprite(inicioX, inicioY, 'canonDown'); break;
            case Phaser.ANGLE_LEFT:     this.sprite = game.add.sprite(inicioX, inicioY, 'canonLeft'); break;
            case Phaser.ANGLE_RIGHT:    this.sprite = game.add.sprite(inicioX, inicioY, 'canonRight'); break;
        }
        this.sprite.anchor.setTo(.5,.5);
        // Create weapon
        this.laser = game.add.weapon(30, 'bullet');
        this.laser.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.laser.bulletSpeed = 300;
        this.laser.fireRate = 100;
        this.laser.fireAngle = dir;
        game.physics.enable(this.laser.bullets, Phaser.Physics.ARCADE);
        
        // Attach weapon to canon        
        this.laser.trackSprite(this.sprite, 0, 0, false);
    }
    
    /**
    Dispara un laser
    */
    Canon.prototype.fire = function () {
        this.laser.fire();
        game.time.events.add(Phaser.Timer.SECOND*2.5 , this.fire, this);
    }
    
    /**
    ver droid.collisionDroid
    */
    Canon.prototype.collisionBullet = function () {
        if (game.player.animating == false){
            game.player.tweenHurt.start();
            game.player.animating = true;
            game.time.events.add(Phaser.Timer.SECOND*1.5, game.player.lessLives);
        }
    }
        
    return Canon;
    
});