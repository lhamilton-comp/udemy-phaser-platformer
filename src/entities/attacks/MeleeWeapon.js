import Phaser from "phaser";
import EffectManager from "../../effects/EffectManager"
import collidable from "../mixins/collidable"
import { getTimeStamp } from "../../util/functions"

class MeleeWeapon extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(10);
    this.swingAnim = key + "-swing";
    this.effectManager = new EffectManager(scene);

    this.on("animationcomplete", (animation) => {
      if (animation.key == this.swingAnim) {
        this.reset();
      }
    });

    this.damage = 20;
    this.cooldown = 500;

    Object.assign(this, collidable);
    this.reset();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (!this.active) { return };
    if (this.wielder.lastDirection == Phaser.Physics.Arcade.FACING_LEFT) {
      this.setFlipX(true);
      this.body.reset((this.wielder.x - 15), this.wielder.y);
    } else if (this.wielder.lastDirection == Phaser.Physics.Arcade.FACING_RIGHT) {
      this.setFlipX(false);
      this.body.reset((this.wielder.x + 15), this.wielder.y);
    }
  }

  swing(source) {
    if (this.onCooldown) {return};
    this.wielder = source;
    this.setActive(true);
    this.setVisible(true);
    this.anims.play(this.swingAnim, true);
    this.timeFromLastSwing = getTimeStamp();
  }

  deliversHit(target) {
    const impactPoint = {x: this.x, y: this.getRightCenter().y}
    this.effectManager.playEffectOn("hit", target, impactPoint);
    this.body.checkCollision.none = true;
  }

  reset() {
    this.setActive(false);
    this.setVisible(false);
    this.body.reset(0, 0);
    this.body.checkCollision.none = false;
  }

  get onCooldown() {
    return (this.timeFromLastSwing
        && (this.timeFromLastSwing + this.cooldown) > getTimeStamp());
  }

}

export default MeleeWeapon;
