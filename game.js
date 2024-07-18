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
new Phaser.Game(config)

function preload() {
    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    )
    
    this.load.spritesheet(
        'mario',
        'assets/entities/mario.png',
        {frameWidth: 14} //lo que ocupa el año del primer mario
    )
}

function create() {
    this.add.image(100,50,'cloud1')
    .setScale(0.15)
    .setOrigin(0,0)

    this.add.sprite(50,200, 'mario')
    .setOrigin(0,1)

}

function update() {}
