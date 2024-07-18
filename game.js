import {createAnimations} from "./animations.js"

/*Global Phaser */
const config = {
  type: Phaser.AUTO, //tipo de renderizado webgl, canvas or auto
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: "game", //donde se va renderizar
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }, //añadir gravedad
      debug: false,
    },
  },

  scene: {
    preload, //se ejecuta para cargar los recursos
    create, //se ejecuta ccuando el juego comienza
    update, //se ejecuta en cada frame
  },
};

//inicializar
new Phaser.Game(config)

function preload() {
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");
  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");
  this.load.spritesheet(
    "mario",
    "assets/entities/mario.png",
    { frameWidth: 18, frameHeight: 16 } //lo que ocupa el año del primer mario
  )

  this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
  this.load.audio('jump', 'assets/sound/effects/jump.mp3')
  this.load.audio('basic-music', 'assets/sound/music/overworld/theme.mp3')
}

function create() {
  //x,y,id
  this.add.image(100, 50, "cloud1")
    .setScale(0.15)
    .setOrigin(0, 0)

  //añadir un grupo estático para el suelo
  this.floor = this.physics.add.staticGroup();
  this.floor
    .create(0, config.height-16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody() //sincronizar la posicion y tamaño con el body
  this.floor
    .create(200, config.height-16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody()

  /* this.add
    .tileSprite(0, config.height, config.width-130, 32, "floorbricks")
    .setOrigin(0, 1);*/ //es una textura, se puede expandir

  //guardar el mario para que pueda mover -->
  //this.mario = this.add.sprite(50, 210, "mario").setOrigin(0, 1);

  this.mario = this.physics.add.sprite(50, 100, "mario")
    .setOrigin(0, 1)
    .setCollideWorldBounds(true) //tiene que colisionar con el mundo

    //limites del mundo
    this.physics.world.setBounds(0, 0, 2000, config.height) //indexX, indexY, limiteX, limiteY

  //añadir colision con el suelo
  this.physics.add.collider(this.mario, this.floor);

  //crear las teclas para poder visualizarlas en update
  this.keys = this.input.keyboard.createCursorKeys();

  //camara
  this.cameras.main.setBounds(0,0,2000, config.height)
  this.cameras.main.startFollow(this.mario)

  createAnimations (this)

  //this.sound.play('basic-music');
}

function update() {
  if (this.mario.isDead) return 
  
  if (this.keys.left.isDown) {
    this.mario.x -= 2;
    this.mario.anims.play("mario-walk", true);
    this.mario.flipX = true;
  } else if (this.keys.right.isDown) {
    this.mario.x += 2;
    this.mario.anims.play("mario-walk", true);
    this.mario.flipX = false;
  } else {
    /*
    this.mario.anims.stop()
    this.mario.setFrame(0) */
    this.mario.anims.play("mario-idle", true);
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    //this.mario.y -= 5;
    this.mario.setVelocityY(-100)
    this.mario.anims.play("mario-jump", true)
    this.sound.add('jump', {volume : 0.2}).play()
  } else if (!this.mario.body.touching.down){
    this.mario.anims.play("mario-jump", true);
  }

  if (this.mario.y >= config.height){
    this.mario.isDead = true
    this.mario.anims.play('mario-dead', true)
    this.mario.setVelocityY(-100)
    this.mario.setCollideWorldBounds(false)
    this.sound.play('gameover')

    setTimeout(() => {
        this.scene.restart()
    }, 2000)
  }
}
