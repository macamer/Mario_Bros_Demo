/*Global Phaser */
const config = {
  type: Phaser.AUTO, //tipo de renderizado webgl, canvas or auto
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: "game", //donde se va renderizar

  scene: {
    preload, //se ejecuta para cargar los recursos
    create, //se ejecuta ccuando el juego comienza
    update, //se ejecuta en cada frame
  },
};

//inicializar
new Phaser.Game(config);

function preload() {
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");

  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");
  this.load.spritesheet(
    "mario",
    "assets/entities/mario.png",
    { frameWidth: 18, frameHeight: 16 } //lo que ocupa el año del primer mario
  );
}

function create() {
    //x,y,id
  this.add.image(100, 50, "cloud1").setScale(0.15).setOrigin(0, 0);
    this.add.tileSprite(0, config.height, config.width, 32, 'floorbricks')
    .setOrigin(0,1) //es una textura, se puede expandir
  this.add.sprite(50, 210, "mario").setOrigin(0, 1);

  //crear las teclas para poder visualizarlas en update
  this.keys = this.input.keyboard.createCursorKeys()

}

function update() {}
