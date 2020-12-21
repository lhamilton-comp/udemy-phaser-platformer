import Phaser from "phaser";
import SpriteEffect from "../../effects/SpriteEffect"
import EffectManager from "../../effects/EffectManager"

class Projectile extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize((this.width - 13), (this.height - 20));

    this.speed = 300;
    this.maximumDistance = 300;
    this.cooldown = 500;
    this.damage = 10;

    this.travelDistance = 0;

    this.effectManager = new EffectManager(scene);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.travelDistance += this.body.deltaAbsX();
    if (this.travelDistance >= this.maximumDistance) {
      this.reset();
    }
  }

  fire(x, y, anim) {
    this.setActive(true);
    this.setVisible(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speed);
    if (anim) { this.play(anim, true) };
  }

  deliversHit(target) {
    const impactPoint = {x: this.x, y: this.y}
    this.effectManager.playEffectOn("hit", target, impactPoint);
    this.reset();
  }

  reset() {
    this.body.reset(0, 0);
    this.setActive(false);
    this.setVisible(false);
    this.travelDistance = 0;
  }



}

export default Projectile;
