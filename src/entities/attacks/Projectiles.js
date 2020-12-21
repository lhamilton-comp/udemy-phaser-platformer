import Phaser from "phaser";
import Projectile from "./Projectile"
import collidable from "../mixins/collidable"
import { getTimeStamp } from "../../util/functions"

class Projectiles extends Phaser.Physics.Arcade.Group {

  constructor(scene, key) {
    super(scene.physics.world, scene);
    this.createMultiple({
      frameQuantity: 5,
      active: false,
      visible: false,
      key,
      classType: Projectile
    });
    Object.assign(this, collidable);
  }

  fireProjectile(source, anim) {
    const projectile = this.getFirstDead(false);
    if (!projectile) { return };
    if (this.timeFromLastFiring
        && this.timeFromLastFiring + projectile.cooldown > getTimeStamp()) {
      return;
    }

    const spawn = source.getCenter();

    if (source.lastDirection == Phaser.Physics.Arcade.FACING_LEFT) {
      projectile.speed = -Math.abs(projectile.speed);
      projectile.setFlipX(true);
      spawn.x -= 10;
    } else if (source.lastDirection == Phaser.Physics.Arcade.FACING_RIGHT) {
      projectile.speed = Math.abs(projectile.speed);
      projectile.setFlipX(false);
      spawn.x += 10;
    }
    projectile.fire(spawn.x, spawn.y, anim);
    this.timeFromLastFiring = getTimeStamp();
  }

}

export default Projectiles;
