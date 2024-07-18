/*Global Phaser */
const config = {
  type: Phaser.AUTO, //tipo de renderizado webgl, canvas or auto
  width: 256,
  height: 244,
  backgroundColor: "#ffffff",
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
    console.log('preload');
}

function create() {
    console.log('create')
}

function update() {}
