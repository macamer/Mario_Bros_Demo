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
let player
let money
let floor
let misteryBlocks
let enemies
let score = 0, points = 0, scoreUp
let coinText, marioText, marioScore, timeText
let lives, time = 400
let heightFloor = config.height - 16
let empty = false
let music


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
  this.load.image('emptyBlock', 'assets/blocks/overworld/emptyBlock.png')
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
  this.load.audio('empty', 'assets/sound/effects/block-bump.wav')
  this.load.audio('time-warning', 'assets/sound/effects/time-warning.mp3')

}

/* ---------------------------- CREATE ----------------------------- */
function create() {
  createBackground(this)
  createAnimations (this)
  
  //poner puntuación
  coinText = this.add.text(90, 10, 'x00', { fontSize: '10px', fill: '#ffff' })
    .setOrigin(0,0)
    .setScrollFactor(0) //Fijar el texto en la camara
  marioText = this.add.text(20, 10, 'MARIO', { fontSize: '10px', fill: '#ffff' })
    .setOrigin(0,0)
    .setScrollFactor(0)
  marioScore = this.add.text(20, 20, '000000', { fontSize: '10px', fill: '#ffff' })
    .setOrigin(0,0)
    .setScrollFactor(0)
  this.add.text(150, 10, 'WORLD', { fontSize: '10px', fill: '#ffff' })
    .setOrigin(0,0)
    .setScrollFactor(0)
  this.add.text(150, 20, '1-1', { fontSize: '10px', fill: '#ffff' })
    .setOrigin(0,0)
    .setScrollFactor(0)
  this.add.text(210, 10, 'TIME', { fontSize: '10px', fill: '#ffff' })
    .setOrigin(0,0)
    .setScrollFactor(0)
  timeText = this.add.text(210, 20, time, { fontSize: '10px', fill: '#ffff' })
    .setOrigin(0,0)
    .setScrollFactor(0)
  
  this.add.sprite(75, 10, "coin").setOrigin(0, 0).setScrollFactor(0).setScale(0.7)
  
  //añadir un grupo estático para el suelo
  floor = this.physics.add.staticGroup()
  createFloor(floor, heightFloor)

  /* this.add
    .tileSprite(0, config.height, config.width-130, 32, "floorbricks")
    .setOrigin(0, 1);*/ //es una textura, se puede expandir

  //guardar el mario para que pueda mover -->
  //this.mario = this.add.sprite(50, 210, "mario").setOrigin(0, 1);

  player = this.physics.add.sprite(20, 195, "mario")
    // .setOrigin(0, 0)
    .setCollideWorldBounds(true) //tiene que colisionar con el mundo
  player.isDead = false

  //limites del mundo
  this.physics.world.setBounds(0, 0, 2000, config.height) //indexX, indexY, limiteX, limiteY

  //crear las teclas para poder visualizarlas en update
  this.keys = this.input.keyboard.createCursorKeys()

  //camara
  this.cameras.main.setBounds(0,0,2000, config.height)
  this.cameras.main.startFollow(player)
  
  //añadir colision con el suelo
  this.physics.add.collider(player, floor)

  //mistery block
  misteryBlocks = this.physics.add.staticGroup({
    allowGravity: false
  })

  this.misteryBlock = misteryBlocks.create(220, 160, 'misteryBlock')
    .setOrigin(0,0)
    .refreshBody()

  this.misteryBlock.anims.play('mistery')
  
  this.physics.add.collider(player,misteryBlocks, hitBlock, null, this)
 
  //colindar con monedas
  money = this.physics.add.group({
    allowGravity: false //desactivar la gravedad
  })
  let coin = money.create(300, 180, 'coin')
    .setOrigin(0,0)
    .refreshBody()
  coin.anims.play('coin-rotates')
  
  this.physics.add.overlap(player, money, collectMoney, null, this)
  
  //enemigos
  enemies = this.physics.add.group()
  createEnemies(this, enemies)
  this.physics.add.collider(enemies, floor)
  
  // Colisiones con enemigos
  //this.physics.add.collider(player, enemies)
  this.physics.add.overlap(player, enemies, hitEnemy, null, this);
  // this.physics.add.collider(player, enemies, dead, null, this)
  this.physics.add.collider(enemies, floor)

  // Iniciar el temporizador
  this.time.addEvent({
    delay: 1000,
    callback: updateTimer,
    callbackScope: this,
    loop: true
  });

  //musica
  music = this.sound.add('basic-music', {loop : true})
  music.play()

  // Herramientas de depuración
  this.physics.world.createDebugGraphic()
  this.misteryBlock.body.debugShowBody = true
  this.misteryBlock.body.debugBodyColor = 0xff00ff
  misteryBlocks.children.iterate((block) => {
    block.body.debugShowBody = true;
  });
  player.body.debugShowBody = true;
}


/*----------------------------- UPDATE -----------------------------*/
function update() {

  if (player.isDead) {
    score = 0
    time = 400
    return
  } 
  
  if (this.keys.left.isDown) {
    // player.x -= 2 --> con esto pasa a través de los objetos
    player.setVelocityX(-100)
    player.anims.play("mario-walk", true)
    player.flipX = true;
  } else if (this.keys.right.isDown) {
    player.setVelocityX(100)
    player.anims.play("mario-walk", true)
    player.flipX = false
  } else {
    // this.mario.anims.stop()
    // this.mario.setFrame(0) 
    player.setVelocityX(0)
    player.anims.play("mario-idle", true)
  }

  if (this.keys.up.isDown && player.body.touching.down) {
    //this.mario.y -= 5;
    player.setVelocityY(-150)
    player.anims.play("mario-jump", true)
    this.sound.add('jump', {volume : 0.2}).play()
  } else if (!player.body.touching.down) {
    player.anims.play("mario-jump", true)
  }

  if (player.y >= config.height-16){
    console.log("ha muerto")
    dead.call(this, player)
  }

  // enemies.getChildren().forEach(enemy => {
  //   const playerBounds = player.getBounds()
  //   const enemyBounds = enemy.getBounds()
  //   if (player.body.touching.down && player.body.velocity.y > 0) {
  //       console.log('ha tocado en update')
  //     // Verifica si el jugador está tocando el enemigo por arriba
  //     if (playerBounds.bottom >= enemyBounds.top &&
  //         Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, enemyBounds)) {
  //         console.log('ha tocado por arriba update')
  //           enemy.anims.play("goomba-dead", true)
  //         this.tweens.killTweensOf(enemy)
  //         player.setVelocityY(-100)
  //         this.sound.add('kick').play()
  //         setTimeout(() => {
  //           enemy.disableBody(true, true)
  //         }, 800)
  //     }
  //   }
  // })
}

/* ------------------------- FUNCTIONS -------------------- */

function collectMoney (player, money) {
    money.disableBody(true, true)
    this.sound.add('coin-collect', {volume : 0.2}).play()
    score += 1
    coinText.setText('x0' + score)
    //actualizar puntuación
    points += 1
    marioScore.setText('000' + points)
}


function hitEnemy(player, enemy){
  console.log("toca al enemigo")
  // Verifica si el jugador está cayendo
  console.log('velocidad y:'+ player.body.velocity.y)
  if (player.body.velocity.y != 0) {
    // Comprueba si el jugador está tocando el enemigo desde arriba
    if (player.getBounds().bottom <= enemy.getBounds().top && player.getBounds().right >= enemy.getBounds().left && player.getBounds().left <= enemy.getBounds().right) {
      // El jugador ha tocado al enemigo por arriba
      console.log('Jugador ha tocado el enemigo por arriba')

      // Mostrar puntuación
      scoreUp = this.add.text(enemy.x, enemy.y, '100', { fontSize: '10px', fill: '#ffff' })
        .setOrigin(0.5, 1)

      // Añadir una animación para mover el texto hacia arriba
      this.tweens.add({
        targets: scoreUp,
        y: scoreUp.y - 30, // Mover 30 píxeles hacia arriba
        alpha: 0, // Hacer que se desvanezca
        duration: 1000, // Duración de la animación
        onComplete: function () {
          scoreUp.destroy() // Destruir el texto al finalizar la animación
        }
      })

      enemy.anims.play("goomba-dead", true)
      this.tweens.killTweensOf(enemy)
      player.setVelocityY(-100) // Rebotar al jugador
      this.sound.add('kick').play()

      //actualizar puntuación
      points += 100
      marioScore.setText('000' + points)
      
      // Desactivar el enemigo después de un tiempo
      setTimeout(() => {
        enemy.disableBody(true, true)
      }, 800)
    } else {
      // Si no se cumple la condición de golpe, el jugador muere
      if (!player.isDead) dead.call(this, player);
    }
  } else {
    if(!player.isDead) dead.call(this, player)
  }
}

function dead(player){
  console.log('dead')
  player.isDead = true
  player.anims.play('mario-dead', true)
  player.setVelocityY(-100)
  player.setCollideWorldBounds(false)
  player.body.checkCollision.none = true

  if (music) music.stop()
  let deadSound = this.sound.add('gameover')
  deadSound.play()
  
  setTimeout(() => {
    deadSound.stop()
    this.scene.restart()
  }, 3000)
  
}

function hitBlock (player, misteryBlock) {

  if (player.getBounds().top >= misteryBlock.getBounds().bottom) {
    console.log(empty)
    if(!empty){
      this.sound.add('coin-collect', {volume : 0.2}).play()
      score += 1
      coinText.setText('x0' + score)
      empty = true
    } else {
      this.sound.add('empty').play()
    }

  }

}

function updateTimer() {
  if (time > 0) {
    time--
    timeText.setText(time)
  } else if (time = 50 ) {
    this.sound.add('time-warning').play()
  } else {
    // Si el tiempo llega a 0, manejar la lógica de fin del juego
    if (!player.isDead) dead.call(this, player)
  }
}
