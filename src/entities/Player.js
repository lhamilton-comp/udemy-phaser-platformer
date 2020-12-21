import Phaser from "phaser";
import initAnims from "./anims/playerAnims"
import collidable from "./mixins/collidable"
import animated from "./mixins/animated"
import Projectiles from "./attacks/Projectiles"
import MeleeWeapon from "./attacks/MeleeWeapon"
import Emitter from "../events/Emitter"

const VELOCITY = 150;
const THRUST = -VELOCITY * 2;
const BOUNCE_SPEED = 250;
const JUMPS = 2;

class Player extends Phaser.Physics.Arcade.Sprite {

  static MIXINS = [collidable, animated];

  constructor(scene, x, y) {
    super(scene, x, y, "player");
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.init(scene);
    this.addToScene(scene);
    this.setupWeapons(scene);
    this.sfx = this.createSounds(scene);
    this.bindControls(scene);
    this.setupSteps(scene);

    Player.MIXINS.forEach((mixin) => Object.assign(this, mixin));
  }

  init(scene) {
    this.health = 50;
    this.jumps = 0;
    this.isHit = false;
    this.sliding = false;
    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
  }

  addToScene(scene) {
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(22, 36);
    initAnims(scene.anims);
  }

  setupWeapons(scene) {
    this.projectiles = new Projectiles(scene, "iceball-1");
    this.meleeWeapon = new MeleeWeapon(scene, 0, 0, "sword-default");
  }

  createSounds(scene) {
    return {
      step: scene.sound.add("step", {volume: 0.2}),
      jump: scene.sound.add("jump", {volume: 0.2}),
      shoot: scene.sound.add("shoot", {volume: 0.2}),
      swing: scene.sound.add("swing", {volume: 0.2})
    }
  }

  bindControls(scene) {
    this.cursors = scene.input.keyboard.createCursorKeys();
    scene.input.keyboard.on("keydown-DOWN", () => {
      this.body.setSize(this.width, (this.height / 2));
      this.setOffset(0, (this.height / 2));
      this.play("slide", true);
      this.sliding = true;
    });
    scene.input.keyboard.on("keyup-DOWN", () => {
      this.body.setSize(this.width, this.height);
      this.setOffset(0, 0);
      this.sliding = false;
    });
    scene.input.keyboard.on("keydown-Q", () => {
      this.play("throw", true);
      this.sfx.shoot.play();
      this.projectiles.fireProjectile(this, "iceball");
    });
    scene.input.keyboard.on("keydown-E", () => {
      if (!this.meleeWeapon.onCooldown) {
        this.play("throw", true);
        this.sfx.swing.play();
        this.meleeWeapon.swing(this);
      }
    });
  }

  setupSteps(scene) {
    scene.time.addEvent({
      delay: 350,
      repeat: -1,
      callbackScope: this,
      callback: () => {
        if (this.isPlayingAnim('run')) {
          this.sfx.step.play();
        }
      }
    });
  }

  update() {
    if (!this.body) { return };
    if (this.getBounds().top > this.scene.config.height) {
      Emitter.emit("GAME_OVER");
      return;
    };
    const onFloor = this.body.onFloor();
    if (onFloor) this.jumps = 0;
    this.handleControls(onFloor);
    this.handleAnimations(onFloor);
  }

  handleControls(onFloor) {
    if (this.isHit || this.sliding) { return };

    const {left, right, space, down} = this.cursors;
    const spaceJustDown = Phaser.Input.Keyboard.JustDown(space);

    if (left.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
      this.setVelocityX(-VELOCITY);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT
      this.setVelocityX(VELOCITY);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (spaceJustDown && (onFloor || this.jumps < JUMPS)) {
      this.sfx.jump.play();
      this.setVelocityY(THRUST);
      this.jumps++;
    }
  }

  handleAnimations(onFloor) {
    if (this.isPlayingAnim("throw") || this.sliding) { return };
    let anim = onFloor ? (this.body.velocity.x ? "run" : "idle") : "jump";
    this.play(anim, true);
  }

  takesHit(source) {
    if (this.isHit) { return };

    this.isHit = true;
    this.takeDamage(source.damage || source.properties.damage || 0);

    if (this.health <= 0) {
      Emitter.emit("GAME_OVER");
      return;
    }

    this.bounceOff(source);
    let hitTween = this.hitTween();

    this.scene.time.delayedCall(1000, () => {
      this.isHit = false;
      hitTween.stop();
      this.clearTint();
    });
  }

  bounceOff(source) {
    const edgeCheck = source.body ? "touching" : "blocked";
    const velocity = this.body[edgeCheck].right ? -BOUNCE_SPEED : BOUNCE_SPEED;
    this.setVelocityX(velocity);
    setTimeout(() => this.setVelocityY(-BOUNCE_SPEED), 0);
  }

  takeDamage(damage) {
    this.health -= damage;
    this.scene.hud.healthBar.update(this.health);
  }

  hitTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 4,
      tint: 0xffffff
    });
  }


}

export default Player;
