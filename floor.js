export const createFloor = (floor, heightFloor) => {
  floor.create(0, heightFloor, "floorbricks").setOrigin(0, 0.5).refreshBody(); //sincronizar la posicion y tamaño con el body
  floor.create(128, heightFloor, "floorbricks");
  floor.create(256, heightFloor, "floorbricks");
  floor.create(384, heightFloor, "floorbricks");
  floor.create(512, heightFloor, "floorbricks");
  floor.create(640, heightFloor, "floorbricks");
  floor.create(768, heightFloor, "floorbricks");
};
