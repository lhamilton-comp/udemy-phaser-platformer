import Phaser from "phaser";

class SpriteEffect extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, key, point) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.target = null;
    this.key = key;
    this.point = point;

    this.on("animationcomplete", (animation) => {
      if (animation.key == this.key) { this.destroy() };
    });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.placeEffect();
  }

  placeEffect() {
    if (!this.target || !this.body) { return };
    const center = this.target.getCenter();
    this.body.reset(center.x, this.point.y);
  }

  playOn(target) {
    this.target = target;
    this.play(this.key, true);
    this.placeEffect();
  }

}

export default SpriteEffect;
