import Base from "./Base"


class Menu extends Base {

  constructor(config) {
    super("Menu", config);
    this.menu = [
      {scene: "Play", text: "Play", level: 1},
      {scene: "Levels", text: "Levels"},
      {action: () => this.exit(), text: "Exit"}
    ]
  }

  create() {
    super.create();
    super.createMenu(this.menu, this);
    //this.scene.start("PlayScene");
  }

  exit(toScene) {
    this.game.destroy(true);
  }

}

export default Menu;
