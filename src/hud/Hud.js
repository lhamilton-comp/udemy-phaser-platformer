import Phaser from "phaser";

const FONT_SIZE = 20;

class Hud extends Phaser.GameObjects.Container {

  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    const {rightTopCorner} = scene.config;
    this.setPosition((rightTopCorner.x - 70), (rightTopCorner.y + 5));
    this.setScrollFactor(0);
    this.setupList();
  }

  setupList() {
    const scoreBoard = this.createScoreBoard();
    this.add(scoreBoard);
  }

  createScoreBoard() {
    const scoreText = this.scene.add.text(0, 0, "0", {
      fontSize: `${FONT_SIZE}px`,
      fill: "#FFF"
    });
    const scoreImage = this.scene.add.image((scoreText.width + 5), 0, "diamond")
      .setOrigin(0)
      .setScale(1.3);
    const scoreBoard = this.scene.add.container(0, 0, [scoreText, scoreImage]);
    scoreBoard.setName("score-board");
    return scoreBoard;
  }

  updateScoreBoard(newScore) {
    const [scoreText, scoreImage] = this.getByName("score-board").list;
    scoreText.setText(newScore);
    scoreImage.setX(scoreText.width + 5);
  }
}

export default Hud;
