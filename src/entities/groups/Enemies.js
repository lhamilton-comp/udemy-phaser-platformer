import Phaser from "phaser";
import collidable from "../mixins/collidable"

class Enemies extends Phaser.GameObjects.Group {

  constructor(scene) {
    super(scene);
    Object.assign(this, collidable);
  }

  get projectiles() {
    const projectiles = new Phaser.GameObjects.Group();
    this.getChildren().forEach((enemy) => {
      if (enemy.projectiles) {
        projectiles.addMultiple(enemy.projectiles.getChildren());
      }
    });
    return projectiles;
  }
}

export default Enemies;
