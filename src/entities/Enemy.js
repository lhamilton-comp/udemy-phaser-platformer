import Phaser from "phaser";
import collidable from "./mixins/collidable"
import animated from "./mixins/animated"


class Enemy extends Phaser.Physics.Arcade.Sprite {

  static MIXINS = [collidable, animated];

  static TURN_DELAY = 100;
  static PATROL_LENGTH = 200;

  static BODY_SIZE = null;
  static BODY_OFFSET = null;

  static MOVE_SPEED = 75;
  static MAX_HEALTH = 100;
  static DAMAGE = 20;

  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.addToScene(scene);
    this.setupPatrol();
    this.init();
    this.setVelocityX(this.moveSpeed);
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    Enemy.MIXINS.forEach((mixin) => Object.assign(this, mixin));
  }

  addToScene(scene) {
    const {BODY_SIZE, BODY_OFFSET} = this.constructor;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(BODY_SIZE.width, BODY_SIZE.height);
    this.body.setOffset(BODY_OFFSET.x, BODY_OFFSET.y);
    this.setImmovable(true);
    this.lastDirection = null;
  }

  setupPatrol() {
    this.rayGraphics = this.scene.add.graphics({
      lineStyle: {width: 2, color: 0xffff00}
    });
    this.timers = {lastTurn: 0}
    this.patrolDistance = 0;
  }

  init() {
    const {MOVE_SPEED, MAX_HEALTH, DAMAGE} = this.constructor;
    this.damage = DAMAGE;
    this.health = MAX_HEALTH;
    this.moveSpeed = MOVE_SPEED;
  }

  update(time, delta) {
    super.update(time, delta);
    if (!this.active) { return };

    if (this.body.velocity.x < 0) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
    } else if (this.body.velocity.x > 0) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    }

    if (this.getBounds().bottom > this.scene.config.height) {
      this.cleanup();
      this.destroy();
      return;
    }
    if (this.body && this.body.onFloor()) {
      this.patrol(time, delta);
    }
  }

  patrol(time, delta) {
    const {PATROL_LENGTH, TURN_DELAY} = this.constructor;
    this.patrolDistance += Math.abs(this.body.deltaX());
    const {ray, hasHit} = this.raycast(this.scene.map.layers.platforms);
    if (this.scene.config.debug) {
      this.rayGraphics.clear();
      this.rayGraphics.strokeLineShape(ray);
    }
    if ((!hasHit || this.patrolDistance >= PATROL_LENGTH)
        && (this.timers.lastTurn + TURN_DELAY) < time) {
      this.setFlipX(!this.flipX);
      this.setVelocityX(-this.body.velocity.x);
      this.timers.lastTurn = time;
      this.patrolDistance = 0;
    }
  }

  takesHit(source) {
    this.health -= source.damage;
    if (this.health <=0) {
      this.setTint(0xFF0000);
      this.setVelocity(0, -200);
      this.body.checkCollision.none = true;
      this.setCollideWorldBounds(false);

    }
  }

  cleanup() {
    this.rayGraphics.clear();
    this.setActive(false);
    this.scene.events.removeListener(
      Phaser.Scenes.Events.UPDATE,
      this.update,
      this
    );
  }

}

export default Enemy;
