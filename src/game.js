import Phaser from "phaser"
import Preload from "./scenes/Preload"
import Play from "./scenes/Play"
import Menu from "./scenes/Menu"
import Levels from "./scenes/Levels"
import Credits from "./scenes/Credits"

const MAP_WIDTH = 1600;

const BODY_WIDTH = document.body.offsetWidth;
const BODY_HEIGHT = 600;
const ZOOM_FACTOR = 1.5;

const CONFIG = {
  width: BODY_WIDTH,
  height: BODY_HEIGHT,
  offset: ((MAP_WIDTH > BODY_WIDTH) ? MAP_WIDTH - BODY_WIDTH : 0),
  zoomFactor: ZOOM_FACTOR,
  leftTopCorner: {
    x: ((BODY_WIDTH - (BODY_WIDTH / ZOOM_FACTOR)) / 2),
    y: ((BODY_HEIGHT - (BODY_HEIGHT / ZOOM_FACTOR)) / 2)
  },
  rightTopCorner: {
    x: ((BODY_WIDTH / ZOOM_FACTOR)
      + ((BODY_WIDTH - (BODY_WIDTH / ZOOM_FACTOR)) / 2)),
    y: ((BODY_HEIGHT - (BODY_HEIGHT / ZOOM_FACTOR)) / 2)
  },
  rightBottomCorner: {
    x: ((BODY_WIDTH / ZOOM_FACTOR)
      + ((BODY_WIDTH - (BODY_WIDTH / ZOOM_FACTOR)) / 2)),
    y: ((BODY_HEIGHT / ZOOM_FACTOR)
      + ((BODY_HEIGHT - (BODY_HEIGHT / ZOOM_FACTOR)) / 2))
  },
  debug: false,
  levels: 2
}

const scenes = [Preload, Menu, Levels, Play, Credits];
const initScenes = () => scenes.map((Scene) => new Scene(CONFIG));


const PHASER_CONFIG = {
  ...CONFIG,
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      debug: CONFIG.debug
    }
  },
  pixelArt: true,
  scene: initScenes()
}


new Phaser.Game(PHASER_CONFIG);
