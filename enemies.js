export const createEnemies = (game, enemies) => {
    // Crear un enemigo y añadirlo al grupo
  let enemy = enemies.create(212, 210 , 'goomba').setOrigin(0, 1);

  // Reproducir la animación del enemigo
  enemy.anims.play('goomba-walk');

  // Aplicar un movimiento en el eje Y
  game.tweens.add({
    targets: enemy,
    x: enemy.x + 30,  // Mover 
    duration: 1200,  // Duración del movimiento en milisegundos
    yoyo: true,  // Hacer que el movimiento sea de ida y vuelta
    repeat: -1,  // Repetir indefinidamente
    ease: 'Sine.easeInOut'
  });


}