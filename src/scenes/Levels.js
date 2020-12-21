import Base from "./Base"


class Levels extends Base {

  constructor(config) {
    super("Levels", {...config, hasBack: true});
  }

  create() {
    super.create();
    this.menu = [];
    const levels = this.registry.get("progress");
    for (let i = 1; i <= levels; i++) {
      this.menu.push({scene: "Play", text: `Level ${i}`, level: i});
    }
    super.createMenu(this.menu, this);
  }

  exit(toScene) {
    this.game.destroy(true);
  }

}

export default Levels;
