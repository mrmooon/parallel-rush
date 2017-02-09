define(['Phaser', 'game', 'mapElements/door'], function (Phaser, game, door) {
    
    /**
    Crea un boton con los siguientes parametros:
    @param coordenadaX, coordenadaY posicion del sprite en el mapa
    @param nombreSprite sprite que vamos a utilizar ya que hay distintos tipos de botones
    @param coordenadaXpuerta, coordenadaYpuerta coordenadas de posicion de la puerta que abren
    @param nameDoor sprite de la puerta
    Tiene un atributo sprite que ademas contiene dos atributos adicionales (ya que estos eran necesarios cuando se colisianba con ellos
    pero no se podia acceder a ellos si eran un atributo de button directamente)
    - door: puerta que abre
    - button_up: flag para saber si un boton esta pulsado o no. Por defecto es true cuando se crea el boton
    */
    function button(coordenadaX, coordenadaY, nombreSprite, coordenadaXpuerta, coordenadaYpuerta, nameDoor) {
        this.sprite = game.add.sprite(coordenadaX, coordenadaY, nombreSprite);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.door = new door(coordenadaXpuerta, coordenadaYpuerta, nameDoor);
        this.sprite.button_up = true;
    }
    
    /**
    Cambia el valor de button_up y llama al metodo doorDown de la clase door.
    */
    button.prototype.collisionButton = function(sprite, player) {
        if (sprite.button_up == true){
            sprite.button_up = false;
            sprite.door.doorDown(sprite.door);
        }
    }
    
    /**
    Comprueba el valor de la flag button_up para mostrar una frame u ptra de la hoja de sprite:
    una se corresponde con el boton subido y otra con el bajado.
    */
    button.prototype.checkButton = function (button) {
        if (button.sprite.button_up){ 
            button.sprite.frame = 0; 
        }
        else  
            button.sprite.frame = 1; 
        
        button.sprite.door.checkDoor(button.sprite.door);
    }
    
    return button;
});
