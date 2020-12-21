import Phaser from "phaser";

class Emitter extends Phaser.Events.EventEmitter {

  constructor() {
    super();
  }

}

export default new Emitter();
