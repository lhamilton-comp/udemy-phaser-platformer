import Enemy from "./Enemy";
import initAnims from "./anims/birdmanAnims"


class Birdman extends Enemy {

  static BODY_SIZE = {width: 20, height: 45};
  static BODY_OFFSET = {x: 7, y: 20};

  static MOVE_SPEED = 100;
  static MAX_HEALTH = 40;
  static DAMAGE = 20;

  constructor(scene, x, y) {
    super(scene, x, y, "birdman");
    initAnims(scene.anims);
  }

  update(time, delta) {
    super.update(time, delta);
    if (!this.active) { return };
    if (!this.isPlayingAnim("birdman-hurt")) {
      this.play('birdman-idle', true);
    }
  }

  takesHit(source) {
    super.takesHit(source);
    this.play("birdman-hurt", true);
  }

}

export default Birdman;
