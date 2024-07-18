export const createAnimations = (game) => {
    //crear animación
  game.anims.create({
    key: "mario-walk",
    frames: game.anims.generateFrameNumbers("mario", { start: 1, end: 3 }),
    repeat: -1, //infinito -1
  });

  game.anims.create({
    key: "mario-idle",
    frames: [{ key: "mario", frame: 0 }],
  });

  game.anims.create({
    key: "mario-jump",
    frames: [{ key: "mario", frame: 5 }],
  });

  game.anims.create({
    key: 'mario-dead',
    frames: [{ key: 'mario', frame: 4}]
  })
}