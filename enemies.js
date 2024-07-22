export const createEnemies = (game, enemies) => {
  // Reproducir la animación del enemigo
  const enemyPositions = [
    { x: 240, y: 210 },
    { x: 350, y: 210 }
  ];

  enemyPositions.forEach(pos => {
    let enemy = enemies.create(pos.x, pos.y, 'goomba').setOrigin(0, 1);

  enemy.anims.play('goomba-walk');
  // Aplicar un movimiento en el eje Y
  game.tweens.add({
    targets: enemy,
    x: enemy.x + 30,  // Mover 
    duration: 1200,  // Duración del movimiento en milisegundos
    yoyo: true,  // Hacer que el movimiento sea de ida y vuelta
    repeat: -1,  // Repetir indefinidamente
    ease: 'Sine.easeInOut'
  })
})

}