import Base from "./Base"


class Credits extends Base {

  constructor(config) {
    super("Credits", {...config, hasBack: true});
    this.menu = [
      {text: "Congrats!"},
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

export default Credits;
