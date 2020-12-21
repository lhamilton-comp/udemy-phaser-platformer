import Phaser from "phaser"

const MENU_STYLE = {
  fontSize: "75px",
  fill: "#713E01",
}

const HOVER_STYLE = {
  fill: "#FF0"
}

const LINE_HEIGHT = 85;

const BUTTON_MARGIN = 10;

class Base extends Phaser.Scene {

  constructor(key, config) {
    super(key);
    this.config = config;
    this.width = this.config.width;
    this.height = this.config.height;
    this.center = [this.width / 2, this.height / 2];
  }

  create() {
    this.add.image(0, 0, "menu-bg")
      .setOrigin(0)
      .setScale(2.7);
    this.config.hasBack && this.createBackButton();
  }

  createMenu(menuItems) {
    let indent = 0;
    menuItems.forEach(item => {
      // Create and position text.
      let position = [this.center[0], this.center[1] + indent];
      item.object = this.add.text(...position, item.text, MENU_STYLE)
        .setOrigin(0.5, 1);
      indent += LINE_HEIGHT;
      // Set highlight on hover.
      item.object.setInteractive()
        .on("pointerover", () => item.object.setStyle(HOVER_STYLE))
        .on("pointerout", () => item.object.setStyle(MENU_STYLE));
      // Bind menu actions and scene changes.
      item.object.on("pointerup", () => {
        if (item.action) {
          item.action(item.scene);
        } else {
          item.level && this.registry.set("level", item.level);
          this.scene.start(item.scene);
        }
      });
    });
  }

  createBackButton() {
    let coords = [(this.width - BUTTON_MARGIN), (this.height - BUTTON_MARGIN)];
    this.backButton = this.add.image(...coords, "back")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("Menu");
      })
      .setScale(3)
      .setOrigin(1, 1);
  }

  get bestScore() {
    return localStorage.getItem("bestScore") || 0;
  }

  set bestScore(score) {
    localStorage.setItem("bestScore", score);
  }

}

export default Base;
