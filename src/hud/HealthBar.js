import Phaser from "phaser";

const SIZE = {
  width: 40,
  height: 8
}

const SCALE = 2;
const MARGIN = 2;
const CRITICAL_FACTOR = 1/3;


class HealthBar {

  constructor(scene, x, y, health) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x / SCALE;
    this.y = y / SCALE;
    this.health = health;
    this.pixelsPerHealth = SIZE.width / this.health;
    scene.add.existing(this.bar);
    this.draw();
  }

  draw() {

    const {width, height} = SIZE;
    const {x, y} = this;

    this.bar.clear();
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(x, y, (width + (MARGIN * 2)), (height + (MARGIN * 2)));
    this.bar.fillStyle(0xFFFFFF);
    this.bar.fillRect((x + MARGIN), (y + MARGIN), width, height);
    const healthWidth = Math.floor(this.pixelsPerHealth * this.health);
    this.bar.fillStyle(0x00FF00);
    if (healthWidth < (SIZE.width * CRITICAL_FACTOR)) {
      this.bar.fillStyle(0xFF0000);
    }
    this.bar.fillRect((x + MARGIN), (y + MARGIN), healthWidth, height)

    this.bar.setScrollFactor(0, 0).setScale(SCALE);
  }

  update(newHealth) {
    if (newHealth < 0) {
      this.health = 0;
    } else {
      this.health = newHealth;
    }
    this.draw();
  }

}

export default HealthBar;
