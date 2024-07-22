export const createBackground = (game) => {
//vertical, horizontal, clave
  game.add.image(150, 50, "cloud1")
    .setScale(0.15)
    .setOrigin(0, 0)
  game.add.image(70, 100, "cloud2")
    .setScale(0.15)
    .setOrigin(0, 0)
  game.add.image(0, 240, "mountain2")
    .setOrigin(0, 1)
  game.add.image(300, 212, "mountain1")
    .setOrigin(0, 1)
  game.add.image(250, 212, "bush1")
    .setScale(0.5)
    .setOrigin(0, 1)
  game.add.image(25, 40, 'logo')
    .setScale(0.4)
    .setOrigin(0,0)



}