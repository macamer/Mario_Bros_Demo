import {createAnimations} from "./animations.js"
import { createBackground} from "./backgound.js";
import { createFloor } from "./floor.js";
import { createEnemies } from "./enemies.js";

/*Global Phaser */
const config = {
  type: Phaser.AUTO, //tipo de renderizado webgl, canvas or auto
  width: 256,
  height: 244,
  backgroundColor: "#9ACAF9",
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
    create, //se ejecuta cuando el juego comienza
    update, //se ejecuta en cada frame
  },
};

//añadir variables
let player;
let money;
let floor;
let enemies;
let score = 0;
let scoreText;
let lives;
let heightFloor = config.height - 16;


//inicializar
new Phaser.Game(config)

function preload() {
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");
  this.load.image('cloud2', 'assets/scenery/overworld/cloud2.png')
  this.load.image('mountain1', 'assets/scenery/overworld/mountain1.png')
  this.load.image('mountain2', 'assets/scenery/overworld/mountain2.png')
  this.load.image('bush1', 'assets/scenery/overworld/bush1.png')
  this.load.image('logo', 'assets/scenery/sign.png')
  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");
  this.load.spritesheet(
    "mario",
    "assets/entities/mario.png",
    { frameWidth: 18, frameHeight: 16 } //lo que ocupa el primer mario
  )
  this.load.spritesheet(
    "coin",
    "assets/collectibles/coin.png",
    { frameWidth: 16, frameHeight: 16 } 
  )
  this.load.spritesheet(
    "goomba",
    "assets/entities/overworld/goomba.png",
    { frameWidth: 16, frameHeight: 16 } 
  )
  this.load.spritesheet(
    "misteryBlock",
    "assets/blocks/overworld/misteryBlock.png",
    { frameWidth: 16, frameHeight: 16 } 
  )


  this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
  this.load.audio('jump', 'assets/sound/effects/jump.mp3')
  this.load.audio('basic-music', 'assets/sound/music/overworld/theme.mp3')
  this.load.audio('coin-collect', 'assets/sound/effects/coin.mp3')
  this.load.audio('kick', 'assets/sound/effects/kick.mp3')
}

function create() {
  createBackground(this)
  
  //poner puntuación
  scoreText = this.add.text(90, 10, 'x00', { fontSize: '10px', fill: '#ffff' })
    .setOrigin(0,0)
    .setScrollFactor(0) //Fijar el texto en la camara
  
  this.add.sprite(75, 10, "coin").setOrigin(0, 0).setScrollFactor(0).setScale(0.7)
  
  //añadir un grupo estático para el suelo
  floor = this.physics.add.staticGroup();
  createFloor(floor, heightFloor)
  
  /* this.add
    .tileSprite(0, config.height, config.width-130, 32, "floorbricks")
    .setOrigin(0, 1);*/ //es una textura, se puede expandir

  //guardar el mario para que pueda mover -->
  //this.mario = this.add.sprite(50, 210, "mario").setOrigin(0, 1);

  player = this.physics.add.sprite(20, 100, "mario")
    .setOrigin(0, 1)
    .setCollideWorldBounds(true) //tiene que colisionar con el mundo
  player.isDead = false

  //limites del mundo
  this.physics.world.setBounds(0, 0, 2000, config.height) //indexX, indexY, limiteX, limiteY

  //añadir colision con el suelo
  this.physics.add.collider(player, floor);

  //crear las teclas para poder visualizarlas en update
  this.keys = this.input.keyboard.createCursorKeys();

  //camara
  this.cameras.main.setBounds(0,0,2000, config.height)
  this.cameras.main.startFollow(player)

  createAnimations (this)

  //colindar con monedas
  money = this.physics.add.group({
    allowGravity: false //desactivar la gravedad
  })
  let coin = money.create(300, 180, 'coin-rotates').refreshBody().setOrigin(0,0)
  coin.anims.play('coin-rotates')

  this.physics.add.overlap(player, money, collectMoney, null, this)

  //enemigos
  enemies = this.physics.add.group()
  createEnemies(this, enemies)

  // Colisiones con enemigos
  this.physics.add.collider(player, enemies)
  this.physics.add.collider(player, enemies, dead, null, this)
  this.physics.add.overlap(player, enemies, hitEnemy, null, this);
  this.physics.add.collider(enemies, floor);

  //this.sound.play('basic-music');
}

function update() {
  if (player.isDead) return 
  
  if (this.keys.left.isDown) {
    player.x -= 2;
    player.anims.play("mario-walk", true);
    player.flipX = true;
  } else if (this.keys.right.isDown) {
    player.x += 2;
    player.anims.play("mario-walk", true);
    player.flipX = false;
  } else {
    /*
    this.mario.anims.stop()
    this.mario.setFrame(0) */
    player.anims.play("mario-idle", true);
  }

  if (this.keys.up.isDown && player.body.touching.down) {
    //this.mario.y -= 5;
    player.setVelocityY(-100)
    player.anims.play("mario-jump", true)
    this.sound.add('jump', {volume : 0.2}).play()
  } else if (!player.body.touching.down) {
    player.anims.play("mario-jump", true);
  }

  if (player.y >= config.height){
    console.log("ha muerto")
    dead.call(this, player)
  }

  enemies.getChildren().forEach(enemy => {
    const playerBounds = player.getBounds();
    const enemyBounds = enemy.getBounds();
  if (player.body.touching.down && player.body.velocity.y > 0) {
    
    
    // Verifica si el jugador está tocando el enemigo por arriba
    if (playerBounds.bottom >= enemyBounds.top &&
        Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, enemyBounds)) {
        enemy.anims.play("goomba-dead", true);
        this.tweens.killTweensOf(enemy);
        player.setVelocityY(-100)
        this.sound.add('kick').play()
        console.log('ha dado')
        setTimeout(() => {
          enemy.disableBody(true, true)
        }, 800)
    }
  }
})
}

function collectMoney (player, money) {
    money.disableBody(true, true);
    this.sound.add('coin-collect', {volume : 0.2}).play()

    score += 1;
    scoreText.setText('x0' + score);
}

function hitEnemy(player, enemy){
  console.log("hit enemy")
  if(!player.isDead){
    dead.call(this, player)
  }
  if (player.getBounds().bottom >= enemy.getBounds().top) {
    // El jugador ha tocado el enemigo por arriba
    console.log('Jugador ha tocado el enemigo por arriba');
    
    // Aquí puedes implementar la lógica para el daño al enemigo o la muerte del enemigo
  }
}

function dead(player){
  console.log('dead')
  player.isDead = true
  player.anims.play('mario-dead', true)
  player.setVelocityY(-100)
  player.setCollideWorldBounds(false)
  player.body.checkCollision.none = true;
  let deadSound = this.sound.add('gameover')
  deadSound.play()

  setTimeout(() => {
    deadSound.stop()
      this.scene.restart()
  }, 3000)
}