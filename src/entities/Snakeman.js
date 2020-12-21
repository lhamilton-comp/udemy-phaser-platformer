import Enemy from "./Enemy";
import Projectiles from "./attacks/Projectiles"
import initAnims from "./anims/snakemanAnims"


class Snakeman extends Enemy {

  static BODY_SIZE = {width: 12, height: 45};
  static BODY_OFFSET = {x: 10, y: 15};

  static MOVE_SPEED = 50;
  static MAX_HEALTH = 60;
  static DAMAGE = 10;

  constructor(scene, x, y) {
    super(scene, x, y, "snakeman");
    initAnims(scene.anims);
    this.setupProjectiles();
  }

  setupProjectiles() {
    this.projectiles = new Projectiles(this.scene, "fireball-1");
    this.timeFromLastFiring = 0;
  }

  get attackDelay() {
    return Phaser.Math.Between(1000, 4000);
  }

  update(time, delta) {
    super.update(time, delta);
    if (!this.active) { return };

    if ((this.timeFromLastFiring + this.attackDelay) <= time) {
      this.projectiles.fireProjectile(this, "fireball");
      this.timeFromLastFiring = time;
    }

    if (!this.isPlayingAnim("snakeman-hurt")) {
      this.play('snakeman-idle', true);
    }
  }

  takesHit(source) {
    super.takesHit(source);
    this.play("snakeman-hurt", true);
  }

}

export default Snakeman;
